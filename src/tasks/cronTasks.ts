import cron from 'node-cron';
import { ServiceServices } from '../app/modules/services/services.service';

// Schedule the task to run once a day at midnight (you can adjust the cron expression)
cron.schedule('* * * * *', async () => {
  console.log('Running automated task to mark recommended services...');

  try {
    const result = await ServiceServices.markRecommendedServices();
    console.log(`${result.modifiedCount} services marked as recommended.`);
  } catch (error) {
    console.error('Error while marking recommended services:', error);
  }
});
