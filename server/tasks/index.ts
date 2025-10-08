import { CronJob } from 'cron';
import { useLogger } from '#imports';

import { PaymentProcessorTask } from './payment-processor';
import { PremiumExpirationTask } from './premium-expiration';

export class TasksManager {
  static tasks = [
    PaymentProcessorTask,
    PremiumExpirationTask,
  ];

  static logger = useLogger().withTag('tasks');

  static jobs: CronJob[] = [];

  static setup() {
    this.logger.log('🚀 Setting up scheduled tasks...');

    for (const task of this.tasks) {
      this.logger.log(`📅 Setting up task: ${task.name}`);

      const job = CronJob.from({
        cronTime: task.cronExpression,
        onTick: task.run.bind(task),
        start: true,
        waitForCompletion: task.waitForCompletion,
      });

      this.jobs.push(job);
      this.logger.log(
        `✅ Task ${task.name} scheduled with cron: ${task.cronExpression}`,
      );
    }

    this.logger.log(
      `✅ All ${this.jobs.length} tasks scheduled successfully`,
    );
  }

  static cleanup() {
    this.logger.log('🔄 Stopping all scheduled tasks...');

    return Promise.all(
      this.jobs.map((job) => {
        this.logger.log(
          `⏹️ Stopping task: ${job.name || 'unnamed'}`,
        );
        return Promise.resolve(job.stop());
      }),
    ).then(() => {
      this.logger.log('✅ All tasks stopped successfully');
      this.jobs = [];
    });
  }

  static getStatus() {
    return {
      totalTasks: this.tasks.length,
      activeJobs: this.jobs.length,
      tasks: this.tasks.map((task) => ({
        name: task.name,
        cronExpression: task.cronExpression,
        waitForCompletion: task.waitForCompletion,
      })),
    };
  }
}
