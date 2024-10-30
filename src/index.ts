import {
    getRandomJob, 
    IScrapedJob, 
    ScraperInputType,
    API
} from '@internwave/scrapers-api';

API.onStartScraping(1)(async (args, progressReporter)=>{
    const out: IScrapedJob[] = [];
    const numbJobs = args[0] ? parseInt(args[0]) : 0;
    progressReporter.nextStep("Generating random jobs...", numbJobs)
    for (let i = 0; i < numbJobs; i++) {
      out.push(getRandomJob(i));
      progressReporter.reportProgress(`Generated ${i+1} jobs...`)
    }
    return out;
})
