import Fixture from '@milanbot/services/fixtures/fixture';
import axios from 'axios';

const cronJobUrl = 'https://api.cron-job.org';

const getConfig = () => {
  return {
    headers: {
      'Authorization': `Bearer ${process.env.CRON_JOB_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };
};

const getCreateCronJobPayload = (title: string, date: Date, body: string, url: string) => {
  return {
    'job': {
      'enabled': true,
      'title': title,
      'url': url,
      'schedule': {
        'timezone': 'UTC',
        'hours': [date.getUTCHours()],
        'mdays': [date.getUTCDate()],
        'minutes': [date.getUTCMinutes()],
        'months': [date.getUTCMonth() + 1],
        'wdays': [-1],
      },
      'requestMethod': 1,
      'notification': {
        'onFailure': true,
      },
      'extendedData': {
        'body': body,
      },
    },
  };
};

export const createPreMatchCronJob = async (fixture: Fixture, url: string) => {
  const kickOff = fixture.kickOffDate;
  kickOff.setHours(kickOff.getHours() - 12);
  const payload = getCreateCronJobPayload(
    `Pre-match: ${fixture.home.name} - ${fixture.away.name}`,
    kickOff,
    fixture.stringify(),
    `${url}/pre-match`,
  );
  const response = await axios.put(`${cronJobUrl}/jobs`, payload, getConfig());
  if (response.status != 200) {
    throw new Error(`Failed creating pre-match cron job [${response.status}]`);
  }
};

export const deletePreMatchCronJob = async() => {
  const res = await axios.get(`${cronJobUrl}/jobs`, getConfig());
  const jobs = res.data.jobs;
  for (const job of jobs) {
    if (job.title.toUpperCase() !== 'SCHEDULE') {
      await axios.delete(`${cronJobUrl}/jobs/${job.jobId}`, getConfig());
    }
  }
};

export const createMatchCronJob = async (fixture: Fixture, url: string) => {
  const kickOff = fixture.kickOffDate;
  kickOff.setMinutes(kickOff.getMinutes() - 30);
  const payload = getCreateCronJobPayload(
    `Match: ${fixture.home.name} - ${fixture.away.name}`,
    kickOff,
    fixture.stringify(),
    `${url}/match`,
  );
  const response = await axios.put(`${cronJobUrl}/jobs`, payload, getConfig());
  if (response.status != 200) {
    throw new Error(`Failed creating match cron job [${response.status}]`);
  }
};
