import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { newStyles } from '../shared/CreatableSelectCustomStyles';

const CoversCreatableSelect = ({
  control,
  errors,
  isPendingCovers,
  coversData,
  handleCreateCovers,
}) => {

  console.log(coversData, "cover component");

  const coverOption = useMemo(() =>
    coversData?.covers?.map(cover => ({
      value: cover.id,
      label: cover.name
    })) ?? [],
    [coversData]
  );


  return (
    <div className="w-full xl:w-1/2">
      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
        Cover <span className="text-red-600">*</span>
      </label>
      <Controller
        control={control}
        name="cover"
        rules={{ required: "Cover is required" }}
        render={({ field }) => (
          <CreatableSelect
            {...field}
            options={coverOption}
            isClearable
            isDisabled={isPendingCovers}
            isLoading={isPendingCovers}
            styles={newStyles}
            onChange={async (newValue, actionMeta) => {
              if (actionMeta.action === "create-option") {
                await handleCreateCovers(newValue.label);
              } else {
                field.onChange(newValue);
              }
            }}


            value={field.value}
            placeholder="Select or type a cover..."
            id="cover"
          />
        )}
      />
      {errors?.cover?.message && (
        <p className="format-message error">
          {errors.cover.message}
        </p>
      )}
    </div>
  );
};

export default CoversCreatableSelect;