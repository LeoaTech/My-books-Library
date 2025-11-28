import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "../../../utils/baseAPIURL";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

const templateSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  body: z.string().min(10, "Message body must be at least 10 characters"),
  channel: z.enum(["email", "push", "in-app"], {
    errorMap: () => ({ message: "Please select a valid notification channel" }),
  }),
  event: z.string().min(1, "Event name is required"),
  is_active: z.boolean().default(true),
});


const TemplateEditorModal = ({ template, events, onClose, onSaveSuccess }) => {

  const [activeField, setActiveField] = useState("body");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      subject: "",
      body: "",
      channel: "email",
      event: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (template) {
      reset({
        subject: template?.subject || "",
        body: template?.body || "",
        channel: template?.channel || "email",
        event: template?.event || "",
        is_active: true || template?.is_active !== false,
      });
    }
  }, [template, reset]);

  const selectedChannel = watch("channel");
  const selectedEventKey = watch("event");

  const filteredEvents = useMemo(() => {
    return events.filter((e) => e.channel === selectedChannel);
  }, [selectedChannel, events]);

  const getEventDefinition = (eventKey) => {
    return events?.find((e) => e.key === eventKey);
  };


  const insertVariable = (varKey) => {
    const fieldName = activeField;

    const inputElement = document.getElementById(`${fieldName}-input`);
    if (!inputElement) return;

    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;

    const currentText = getValues(fieldName) || "";
    const variableTag = `{{${varKey}}} `;

    const newText = currentText.substring(0, start) + variableTag + currentText.substring(end);

    setValue(fieldName, newText, { shouldValidate: true, shouldDirty: true });

    setTimeout(() => {
      inputElement.focus();
      inputElement.setSelectionRange(start + variableTag.length, start + variableTag.length);
    }, 0);
  };

  const onSubmit = async (data) => {
    console.log(data, "Saving data")
    try {
      const response = await fetch(`${BASE_URL}/notifications/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to save template");

      const savedData = await response.json();
      toast.success("Template update successfully!");

      onSaveSuccess(savedData);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error saving template. Please try again.");
      onClose();

    }
  };


  const currentEventDef = useMemo(() => {
    return getEventDefinition(selectedEventKey);
  }, [selectedEventKey]);


  const isEditing = !!template?.event;

  return (
    <div className="fixed left-0 top-0 inset-0 bg-[#64748B] bg-opacity-75 transition-opacity dark:bg-slate-300 dark:bg-opacity-75 lg:left-[18rem]">
      <div className="relative p-2 rounded-md">
        <div className="flex justify-end p-5 md:p-10  ">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "#FFF",
              strokeWidth: 2,
            }}
            onClick={onClose}
          />
        </div>

        <div className=" md:mx-20">
          <div className=" p-10 relative rounded-md border border-[#E2E8F0] bg-white shadow-lg dark:border-[#485360] dark:bg-[#24303F] md:px-8 md:py-8 ">

            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div>
                <h2 className="font-bold text-[#313D4A] dark:text-white">
                  {isEditing ? "Edit Template" : "New Template"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Customize how your customers receive notifications.
                </p>
              </div>
              {/* <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button> */}
            </div>
            <div className="max-h-[550px] px-6 w-full overflow-hidden overflow-y-auto text-slate-800">
              <div className="p-6.5 m-5.5 sm:overflow-auto sm:p-2 sm:m-2">

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex-1 overflow-y-auto pr-2 space-y-5"
                >

                  <div className="">

                    <div className="my-2">
                      <label
                        className="block text-sm font-semibold text-[#1c303e] mb-2 dark:text-white"
                      >Notification Channel <span style={{ fontSize: '0.8em', marginLeft: "10px", color: 'gray' }}>
                          (Read-only)
                        </span></label>
                      <select
                        {...register("channel")}
                        disabled={isEditing}
                        className="block w-full rounded-md border-[1.5px] dark:text-white  border-[#E2E8F0] bg-gray-300  dark:disabled:bg-gray-00 disabled:dark:text-gray-400 bg-transparent py-3 px-1 font-medium outline-none transition p-2.5 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"                      >
                        <option value="email">Email</option>
                        <option value="push">Push Notification</option>
                        <option value="in-app">In-App Message</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#1c303e] mb-2 dark:text-white">Event Trigger For <span style={{ fontSize: '0.8em', marginLeft: "10px", color: 'gray' }}>
                        (Read-only)
                      </span></label>
                      <select
                        {...register("event")}
                        disabled={isEditing}
                        className="block w-full rounded-md border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent bg-gray-300  dark:disabled:bg-gray-00 disabled:dark:text-gray-400 py-3 px-2 font-medium outline-none transition p-2.5 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"                      >
                        <option value="">-- Select a Trigger --</option>
                        {filteredEvents.map((evt) => (
                          <option key={evt.key} value={evt.key}>
                            {evt.label}
                          </option>
                        ))}
                      </select>
                      {errors.event && <p className="text-red-500 text-xs mt-1">{errors.event.message}</p>}

                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-semibold text-[#1c303e] mb-2 dark:text-white">
                      {selectedChannel === 'push' ? 'Title' : 'Subject Line'}
                    </label>
                    <input
                      autoFocus
                      type="text"
                      id="subject-input"
                      {...register("subject")}
                      placeholder={
                        watch("channel") === "email"
                          ? "e.g., Welcome to the Library!"
                          : "e.g., New Book Alert!"
                      }
                      onFocus={() => setActiveField("subject")}
                      className="block w-full rounded-md border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 font-medium outline-none transition p-2.5 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>


                  {currentEventDef?.variables?.length > 0 && (
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 dark:bg-blue-100">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-indigo-400 dark:text-indigo-600 uppercase">
                          Insert Variable into {activeField === 'subject' ? 'Subject' : 'Body'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentEventDef.variables.map((v) => (
                          <button
                            key={v.key}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); insertVariable(v.key); }}
                            className="px-3 py-1 bg-white border dark:bg-indigo-100 dark:text-indigo-900 border-indigo-200 dark:border-indigo-600 text-indigo-700 dark:hover:bg-indigo-400 dark:hover:text-white rounded-full text-xs font-medium hover:bg-indigo-100 hover:text-indigo-400 transition-colors"
                          >
                            + {v.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}


                  <div>
                    <label className="block text-sm font-semibold text-[#1c303e] mb-2 dark:text-white">
                      Message Body
                    </label>
                    <textarea
                      id="body-input"
                      rows={8}
                      {...register("body")}
                      onFocus={() => setActiveField("body")}
                      placeholder={
                        watch("channel") === "email"
                          ? "Dear {{name}},\n\nWe are writing to inform you..."
                          : "Hi {{name}}, your book is ready!"
                      }
                      className="block w-full rounded-md border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-3 font-medium outline-none transition p-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.body && (
                      <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-white">
                      Use the buttons above to insert dynamic variables.
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-4 border-t border-gray-100 gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full justify-center rounded-md bg-[#FFBA00] px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"

                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorModal;


