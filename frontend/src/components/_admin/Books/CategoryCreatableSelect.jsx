import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { newStyles } from '../shared/CreatableSelectCustomStyles';

const CategoryCreatableSelect = ({
    control,
    errors,
    isPendingCategories,
    categoriesData,
    handleCreateCategory }) => {

    console.log(categoriesData, "Inside the component");

    const categoryOptions = useMemo(() =>
        categoriesData?.categories?.map(category => ({
            value: category.id,
            label: category.name
        })) || [],
        [categoriesData]
    );


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
                        options={categoryOptions}
                        isClearable
                        isDisabled={isPendingCategories}
                        isLoading={isPendingCategories}
                        styles={newStyles}
                        onChange={async (newValue, actionMeta) => {
                            if (actionMeta.action === "create-option") {
                                const newCategory = await handleCreateCategory(newValue.label);
                                // const newOption = { value: newCategory?.id, label: newCategory?.name };
                                // field.onChange(newOption);
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