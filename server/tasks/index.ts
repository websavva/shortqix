import { CronJob } from 'cron';

import { PaymentProcessorTask } from './payement-processor';
import { PremiumExpirationTask } from './premium-expiration';

export class TasksManager {
  static tasks = [
    PaymentProcessorTask,
    PremiumExpirationTask,
  ];

  static jobs: CronJob[] = [];

  static setup() {
    console.log('🚀 Setting up scheduled tasks...');

    for (const task of this.tasks) {
      console.log(`📅 Setting up task: ${task.name}`);

      const job = CronJob.from({
        cronTime: task.cronExpression,
        onTick: task.run.bind(task),
        start: true,
        waitForCompletion: task.waitForCompletion,
      });

      this.jobs.push(job);
      console.log(
        `✅ Task ${task.name} scheduled with cron: ${task.cronExpression}`,
      );
    }

    console.log(
      `✅ All ${this.jobs.length} tasks scheduled successfully`,
    );
  }

  static cleanup() {
    console.log('🔄 Stopping all scheduled tasks...');

    return Promise.all(
      this.jobs.map((job) => {
        console.log(
          `⏹️ Stopping task: ${job.name || 'unnamed'}`,
        );
        return Promise.resolve(job.stop());
      }),
    ).then(() => {
      console.log('✅ All tasks stopped successfully');
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
