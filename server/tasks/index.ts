import { CronJob } from 'cron';

import { PaymentProcessorTask } from './payement-processor';
import { PremiumExpirationTask } from './premium-expiration';

export const tasks = [
  PaymentProcessorTask,
  PremiumExpirationTask,
];

export async function setupTasks() {
  const jobs: CronJob[] = [];

  for (const task of tasks) {
    const job = CronJob.from({
      cronTime: task.cronExpression,
      onTick: task.run.bind(task),
      start: true,
      waitForCompletion: task.waitForCompletion,
    });

    jobs.push(job);
  }

  return () => {
    return Promise.all(
      jobs.map((job) => Promise.resolve(job.stop())),
    );
  };
}
