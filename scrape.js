import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
  const page = await browser.newPage();

  // Go to Indeed job search page
  await page.goto('https://www.indeed.com/');

  const searchQuery = 'Software developer';
  const locationQuery = 'istanbul';

  // Wait for the search input field to load
  await page.waitForSelector('input[name="q"]');
  
  // Enter the search query and location
  await page.type('input[name="q"]', searchQuery); // Job title input
  await page.type('input[name="l"]', locationQuery); // Location input
  
  // Click on the "Find Jobs" button
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // Wait for job listings to load
  await page.waitForSelector('.jobsearch-SerpJobCard');  // This is the class for job cards

  console.log('Job search results loaded!');

  // Extract job details from the search results page
  const jobs = await page.evaluate(async() => {
    const jobList = [];
    const jobElements =  document.querySelectorAll('.jobsearch-SerpJobCard'); // Correct selector for job cards

   await  jobElements.forEach(jobElement => {
      const jobTitle = jobElement.querySelector('.title')?.innerText || '';
      const companyName = jobElement.querySelector('.company')?.innerText || '';
      const jobLocation = jobElement.querySelector('.location')?.innerText || '';
      const jobLink = jobElement.querySelector('.title a')?.href || '';

      if (jobTitle && companyName) { // Ensure there's valid job data
        jobList.push({ jobTitle, companyName, jobLocation, jobLink });
      }
    });

    return jobList;
  });

  // Check if we scraped any jobs
  if (jobs.length === 0) {
    console.log('No job listings found. Check the page structure or try again later.');
  } else {
    console.log(jobs); // Output the collected job listings
  }

  await browser.close();
})();
