import cron from 'node-cron';
import { ServiceServices } from '../app/modules/services/services.service';

// Schedule the task to run every minute (for testing purposes, change it later to daily)
cron.schedule('* * * * *', async () => {
  console.log(
    'Running automated task to mark recommended and trending services...'
  );

  try {
    // First, mark the services as recommended
    const recommendedResult = await ServiceServices.markRecommendedServices();
    console.log(
      `${recommendedResult.modifiedCount} services marked as recommended.`
    );

    // Then, mark the services as trending
    const trendingResult = await ServiceServices.markTrendingServices();
    console.log(`${trendingResult?.modifiedCount} services marked as trending.`);
  } catch (error) {
    console.error(
      'Error while marking recommended or trending services:',
      error
    );
  }
});
