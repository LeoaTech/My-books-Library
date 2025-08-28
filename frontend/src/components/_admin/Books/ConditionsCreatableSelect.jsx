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
}) => {

    console.log(conditionsData, "Inside the component");

    const conditionOptions = useMemo(() =>
        conditionsData?.conditions?.map(condition => ({
            value: condition.id,
            label: condition.name
        })) ?? [],
        [conditionsData]
    );

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
                        options={conditionOptions}
                        isClearable
                        isDisabled={isPendingConditions}
                        isLoading={isPendingConditions}
                        styles={newStyles}
                        onChange={async (newValue, actionMeta) => {
                            if (actionMeta.action === "create-option") {
                                await handleCreateConditions(newValue.label);
                            } else {
                                field.onChange(newValue);
                            }
                        }}
                        value={field.value}
                        placeholder="Select or type a condition..."
                        id="condition"
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