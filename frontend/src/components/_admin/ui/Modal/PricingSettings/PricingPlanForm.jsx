import { useMemo, useState } from 'react'
import { RxCross1 } from 'react-icons/rx';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingSpinner from '../../../Loader/LoadingSpinner.jsx';
import { usePricingApi } from '../../../../../hooks/settings/usePricingApi.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetchUserPaymentMethod } from '../../../../../hooks/users/useFetchPaymentMethodDetails.jsx';
import { useAuthContext } from '../../../../../hooks/useAuthContext.js';
import { getCurrencyCode } from '../../../../../utils/currencyUtils.js';


const DualPricingPlanForm = ({ entityId, setOpenModal, plan }) => {

  const [newFeature, setNewFeature] = useState('');
  const queryClient = useQueryClient();
  const PKR_MINIMUM_CHARGE = 150;


  const { createPlan, updatePlan, isLoading, deletePlan } = usePricingApi();

  const { data: fetchAccountStatus, isLoading: isLoadingStripeAccountStatus, refetch } = useFetchUserPaymentMethod(entityId);
  const { auth } = useAuthContext();

  // Library currency: Library Country -> Stripe Default Country -> PKR
  const currencyCode = getCurrencyCode(auth?.country) || fetchAccountStatus?.currency || 'pkr';
  const currencyLabel = currencyCode.toUpperCase();


  const schema = useMemo(() => z.object({
    plan_name: z.string().min(1, { message: 'Plan Name is required' }),
    monthly_price: z.coerce.number()
      .min(PKR_MINIMUM_CHARGE, {
        message: `Monthly Price must be at least ${PKR_MINIMUM_CHARGE} ${currencyLabel}.`
      }),
    yearly_price: z.coerce.number()
      .min(PKR_MINIMUM_CHARGE, {
        message: `Yearly Price must be at least ${PKR_MINIMUM_CHARGE} ${currencyLabel}.`
      }),
    monthly_credits_allocated: z.coerce.number().min(0, { message: 'Monthly Credits are required' }),
    yearly_credits_allocated: z.coerce.number().min(0, { message: 'Yearly Credits are required' }),
    features: z.array(z.string().min(1, { message: 'Feature cannot be empty' })).min(1, { message: 'At least one feature is required' }),
  }), [currencyLabel]);
  // Mutation to Create New Plan
  const { mutateAsync: createPlanMutation } = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['pricing']);
      setOpenModal(false);
    },
  });

  // Mutation to Update a Plan
  const { mutateAsync: deletePlanMutation } = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['pricing']);
      setOpenModal(false);
    },
  });

  // Mutation to Delete a Plan
  const { mutateAsync: updatePlanMutation } = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['pricing']);
      setOpenModal(false);
    },
  });

  const defaultFormValues = useMemo(() => ({
    plan_name: plan?.plan_name || '',
    monthly_price: plan?.plan_details?.monthly?.price_value || 0,
    yearly_price: plan?.plan_details?.yearly?.price_value || 0,
    yearly_credits_allocated: plan?.plan_details?.yearly?.credits_allocated || 0,
    monthly_credits_allocated: plan?.plan_details?.monthly?.credits_allocated || 0,
    features: plan?.plan_details?.features || [],
  }), [plan]);
  const {
    register,
    handleSubmit,
    setValue, watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  });

  // Features CREATE,UPDATE OR DELETE
  const features = watch('features') || [];

  const addFeature = () => {
    if (newFeature.trim()) {
      setValue('features', [...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const updateFeature = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setValue('features', updatedFeatures);
  };

  const removeFeature = (index) => {
    setValue('features', features.filter((_, i) => i !== index));
  };

  // Create or Update a Plan
  const onSubmit = async (data) => {
    const apiData = {
      ...data,
      features,
      monthly_duration: 30,
      yearly_duration: 365,
      stripe_account_id: fetchAccountStatus?.account_id,
      currency: currencyCode
    };

    if (plan) {
      // Update Plan details (name or features) and prices

      const isMonthlyPriceChanged =
        apiData.monthly_price !== defaultFormValues.monthly_price ||
        apiData.monthly_credits_allocated !== defaultFormValues.monthly_credits_allocated;

      const isYearlyPriceChanged =
        apiData.yearly_price !== defaultFormValues.yearly_price ||
        apiData.yearly_credits_allocated !== defaultFormValues.yearly_credits_allocated;

      const updatedPayload = {
        plan_id: plan?.plan_id,
        stripe_product_id: plan?.stripe_product_id,
        plan_name: data?.plan_name,
        features,
        isMonthlyPriceChanged: isMonthlyPriceChanged,
        monthlyUpdate: isMonthlyPriceChanged ? {
          monthly_price: data.monthly_price,
          monthly_credits_allocated: data.monthly_credits_allocated,
          monthly_duration: 30,
          monthly_old_price_id: plan.plan_details.monthly.price_id,
        } : {
          price_id: plan.plan_details.monthly.price_id,
          price_value: plan.plan_details.monthly.price_value,
          duration_days: plan.plan_details.monthly.duration_days,
          credits_allocated: plan.plan_details.monthly.credits_allocated
        },
        isYearlyPriceChanged: isYearlyPriceChanged,
        yearlyUpdate: isYearlyPriceChanged ? {
          yearly_price: data.yearly_price,
          yearly_credits_allocated: data.yearly_credits_allocated,
          yearly_duration: 365,
          isChanged: true,
          yearly_old_price_id: plan?.plan_details?.yearly?.price_id,
        } : {
          price_id: plan.plan_details.yearly.price_id,
          price_value: plan.plan_details.yearly.price_value,
          duration_days: plan.plan_details.yearly.duration_days,
          credits_allocated: plan.plan_details.yearly.credits_allocated
        },
      };


      await updatePlanMutation(updatedPayload);
    } else {
      await createPlanMutation(apiData);
    }
  }

  // Delete a Plan
  const handleDeletePlan = async (planId) => {
    await deletePlanMutation(planId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/65 lg:left-[18rem]">
      <div className="relative bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-10 rounded-md shadow-lg ">
        {/* Modal Close button */}
        <div className="absolute top-4 right-4">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "#777",
              strokeWidth: 2,
            }}
            onClick={() => setOpenModal(prev => !prev)}
          />
        </div>

        <div className="flex flex-col justify-between items-center gap-5  overflow-hidden">
          <h3 className="mb-5 font-bold text-[#313D4A] dark:text-white">
            {plan ? "Edit Dual Plan" : "Add Dual Price Plan"}
          </h3>

          <div className="flex justify-between h-[500px] md:h-full overflow-hidden rounded-sm border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47] ">
            <div className="flex-1 overflow-y-auto p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/*  Plan Name */}
                <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                  <div className="w-full" autoFocus>
                    <label htmlFor="plan_name" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Plan Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="plan_name" {...register('plan_name')}
                      className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.plan_name && <p className="text-red-500 text-xs mt-1">{errors.plan_name.message}</p>}
                  </div>


                </div>

                {/*  Prices */}
                <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                  <div className="w-full">
                    <label htmlFor="monthly_price" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Monthly Price (in {currencyLabel}) <span className="text-red-600">*</span>
                    </label>
                    <input id="monthly_price" type="number" {...register('monthly_price', { valueAsNumber: true })}
                      className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.monthly_price && <p className="text-red-500 text-xs mt-1">{errors.monthly_price.message}</p>}
                  </div>
                  <div className="w-full">
                    <label htmlFor="yearly_price" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Yearly Price (in {currencyLabel}) <span className="text-red-600">*</span>
                    </label>
                    <input id="yearly_price" type="number" {...register('yearly_price', { valueAsNumber: true })}
                      className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.yearly_price && <p className="text-red-500 text-xs mt-1">{errors.yearly_price.message}</p>}
                  </div>
                </div>

                {/*  Credits Allocations */}
                <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                  <div className="w-full">
                    <label htmlFor="monthly_credits_allocated" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Monthly Credits Allocated
                    </label>
                    <input id="monthly_credits_allocated" type="number" {...register('monthly_credits_allocated', { valueAsNumber: true })}
                      className="w-full mb-4 rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]" />
                    {errors.monthly_credits_allocated && <p className="text-red-500 text-xs mt-1">{errors.monthly_credits_allocated.message}</p>}
                  </div>
                  <div className="w-full">
                    <label htmlFor="yearly_credits_allocated" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Yearly Credits Allocated
                    </label>
                    <input id="yearly_credits_allocated" type="number" {...register('yearly_credits_allocated', { valueAsNumber: true })}
                      className="w-full mb-4 rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]" />
                    {errors.yearly_credits_allocated && <p className="text-red-500 text-xs mt-1">{errors.yearly_credits_allocated.message}</p>}
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                  <div className="w-full mb-4">
                    <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Features <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Enter a feature"
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        disabled={!newFeature.trim()}
                        className="px-4 py-2 bg-[#454b75] text-white rounded-sm disabled:bg-gray-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      </button>
                    </div>
                    {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features.message}</p>}
                    <div className="mt-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 py-1">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-2 px-3 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />

                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500"
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                fill=""
                              />
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                fill=""
                              />
                              <path
                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                fill=""
                              />
                              <path
                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


                <button type="submit" disabled={!entityId || isLoading || !isDirty}
                  className="w-full mt-4  bg-[#758aae] text-white active:bg-[#80CAEE] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                >
                  {isLoading ? <LoadingSpinner /> : plan ? "Update Plan" : 'Create Plan'}
                </button>

                {plan && (
                  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="mb-3 text-red-500 font-medium text-sm">Danger Zone</p>
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(plan.plan_id)}
                      className="w-full flex justify-center items-center bg-[#ab1414] text-white active:bg-[#da1e2d] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "

                    >
                      <svg
                        className="fill-current mr-2"
                        width="20"
                        height="20"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                      {isLoading ? <LoadingSpinner /> : "Delete Plan"}
                    </button>
                  </div>
                )}


              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default DualPricingPlanForm