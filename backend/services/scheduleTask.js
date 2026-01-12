const corn = require("node-cron");
const { checkOverdueStatusAndFine, checkUpcomingDueDates } = require("./automateProcess.js");


// Run at midnight
corn.schedule("0 0 * * *", async () => {
    console.log('Running daily check for overdue books and add fine for late returns...');
    try {
        await checkOverdueStatusAndFine();
        await checkUpcomingDueDates();
        console.log('Overdue process completed successfully.');
    } catch (error) {
        console.error('Error during overdue process:', error);
    }
}, {
    timezone: "Asia/Karachi", 
});

