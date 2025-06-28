import cron from 'node-cron';
import { ServiceServices } from '../app/modules/services/services.service';

cron.schedule('0 0 * * *', async () => {
  try {
    // First, mark the services as recommended
    const recommendedServices = await ServiceServices.markRecommendedServices();
    console.log(
      `${recommendedServices.modifiedCount} services marked as recommended.`,
    );

    // Then, mark the services as trending
    const trendingServices = await ServiceServices.markTrendingServices();
    console.log(
      `${trendingServices?.modifiedCount} services marked as trending.`,
    );
  } catch (error) {
    console.error(
      'Error while marking recommended or trending services:',
      error,
    );
  }
});
