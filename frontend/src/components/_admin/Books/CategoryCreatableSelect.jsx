import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { newStyles } from '../shared/CreatableSelectCustomStyles';

const CategoryCreatableSelect = ({
    control,
    errors,
    isPendingCategories,
    categoriesData,
    handleCreateCategory,
    setCategories,
    categories }) => {

    console.log(categoriesData, "Inside the component", categories);

    useEffect(() => {
        if (categoriesData?.categories?.length > 0) {
            setCategories(categoriesData?.categories?.map(category => ({
                value: category.id,
                label: category.name
            })) || [])
        }
    }, [categoriesData?.categories, setCategories])


    // Transform categories data into react-select format
    // const categoryOptions = useMemo(() =>
    //     categoriesData?.categories?.map(category => ({
    //         value: category.id,
    //         label: category.name
    //     })) || [],
    //     [categoriesData]
    // );


    return (
        <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                Category <span className="text-red-600">*</span>
            </label>
            <Controller
                control={control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                    <CreatableSelect
                        {...field}
                        options={categories}
                        isClearable
                        isDisabled={isPendingCategories}
                        isLoading={isPendingCategories}
                        styles={newStyles}
                        onChange={(newValue, actionMeta) => {
                            if (actionMeta.action === "create-option") {
                                handleCreateCategory(newValue.label);
                            } else {
                                field.onChange(newValue);
                            }
                        }}
                        value={field.value}
                        placeholder="Select or type a category..."
                    />
                )}
            />
            {errors?.category?.message && (
                <p className="format-message error">
                    {errors.category.message}
                </p>
            )}
        </div>
    );
};

export default CategoryCreatableSelect;