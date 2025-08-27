import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { newStyles } from '../shared/CreatableSelectCustomStyles';

const ConditionsCreatableSelect = ({
    control,
    errors,
    isPendingConditions,
    conditionsData,
    handleCreateConditions,
    setConditions,
    conditions }) => {

    console.log(conditionsData, "Inside the component", conditions);

    useEffect(() => {
        if (conditionsData?.conditions?.length > 0) {
            setConditions(conditionsData?.conditions?.map(condition => ({
                value: condition.id,
                label: condition.name
            })) || [])
        }
    }, [conditionsData?.conditions, setConditions])


    // Transform conditions data into react-select format
    // const conditionOptions = useMemo(() =>
    //     conditionsData?.conditions?.map(condition => ({
    //         value: condition.id,
    //         label: condition.name
    //     })) || [],
    //     [conditionsData]
    // );

   return (
        <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                Condition <span className="text-red-600">*</span>
            </label>
            <Controller
                control={control}
                name="condition"
                rules={{ required: "Condition is required" }}
                render={({ field }) => (
                    <CreatableSelect
                        {...field}
                        options={conditions}
                        isClearable
                        isDisabled={isPendingConditions}
                        isLoading={isPendingConditions}
                        styles={newStyles}
                        onChange={(newValue, actionMeta) => {
                            if (actionMeta.action === "create-option") {
                                handleCreateConditions(newValue.label);
                            } else {
                                field.onChange(newValue);
                            }
                        }}
                        value={field.value}
                        placeholder="Select or type a condition..."
                    />
                )}
            />
            {errors?.condition?.message && (
                <p className="format-message error">
                    {errors.condition.message}
                </p>
            )}
        </div>
    );
};

export default ConditionsCreatableSelect;