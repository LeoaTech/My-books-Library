const corn = require("node-cron");
const { checkOverdueStatusAndFine, checkUpcomingDueDates } = require("./automateProcess.js");
// Run at midnight
corn.schedule("0 0 * * *", async () => {
    console.log('Running daily check for upcoming due date and overdue books to add fine for late returns...');
    try {
        await checkOverdueStatusAndFine();
        await checkUpcomingDueDates();
        console.log('Booking due date and overdue process completed successfully.');
    } catch (error) {
        console.error('Error during booking process:', error);
    }
}, {
    timezone: "Asia/Karachi", 
});

