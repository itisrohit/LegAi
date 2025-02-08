// workers/jobManager.js
export const runJob = async (jobFunction) => {
  try {
    console.log('Starting background job...');
    await jobFunction();
    console.log('Background job completed successfully.');
  } catch (error) {
    console.error('Error in background job:', error);
  }
};

if (require.main === module) {
  runJob(async () => {
    console.log('Job running at:', new Date().toISOString());
  });
}
