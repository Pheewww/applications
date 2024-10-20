import { Router, Request, Response } from 'express';
import { getDailySummaries, getLatestWeather, getDailyAggregates, getCityAggregates } from '../controllers/weatherController';

const router = Router();

router.get('/summaries', async (req: Request, res: Response) => {
  await getDailySummaries(req, res);
});
router.get('/latest/:city', async (req: Request, res: Response) => {
  await getLatestWeather(req, res);
});
router.get('/city-aggregates', async (req: Request, res: Response) => {
  await getCityAggregates(req, res);
});

export default router;
