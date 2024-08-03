import express from 'express';
import { createUrl, deleteUrl, getUrl, getUrls, updateUrl } from '../controllers/url-controller';
import validateUrl from '../middlewares/url-validator';

const router = express.Router();

router.post('/shorten', validateUrl, createUrl);
router.get('/urls', getUrls);
router.get('/url/:id', getUrl);
router.put('/url/:id', validateUrl, updateUrl);
router.delete('/url/:id', deleteUrl);

export default router;
