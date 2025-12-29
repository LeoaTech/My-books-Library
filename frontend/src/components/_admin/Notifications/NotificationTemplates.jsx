import { useMemo, useState } from 'react';
import { useFetchNotificationTemplates } from '../../../hooks/notifications/useFetchNotifications';
import NotificationCard from '../Account/NotificationCard';
import TemplateEditorModal from './TemplateEditiorModal';
import Loader from "../Loader/Loader"

const NotificationTemplates = () => {

    // Fetch Default + DB tamplates List for Notifcation messages
    const { data: templates, isLoading, isError, refetch } = useFetchNotificationTemplates()

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleSaveSuccess = () => {
        refetch();
    };

    // Filter Triggered events
    const filteredData = useMemo(() => {
        if (!templates) return [];
        return templates?.filter((tem) => tem.event).map((eventObj) => (
            {
                key: eventObj.event,
                label: eventObj.event,
                channel: eventObj.channel,
                variables: eventObj?.variables?.map((v) => ({
                    key: v,
                    label: v.toUpperCase()
                })),
            }
        ));
    }, [templates]);


    if (isLoading) {
        return (
            <Loader />
        )
    }
    if (isError) {
        return (
            <p>Error getting templates</p>
        )
    }



    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notification Templates</h1>
                {/* <button onClick={() => handleEditClick({
                    subject: "",
                    body: "",
                    channel: "email",
                    event: "",
                    is_active: true,
                })}>Add New</button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates && templates.map((tem) => (
                    <div key={`${tem.event}-${tem.channel}`} onClick={() => handleEditClick(tem)} className="cursor-pointer">
                        <NotificationCard template={tem} />
                    </div>
                ))}
            </div>

            {isModalOpen && selectedTemplate && (
                <TemplateEditorModal
                    template={selectedTemplate}
                    events={filteredData}
                    onClose={() => setIsModalOpen(false)}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}

        </div>


    )
}

export default NotificationTemplates


