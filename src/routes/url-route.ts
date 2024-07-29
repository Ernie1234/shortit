import express from 'express';
import { createUrl, deleteUrl, getUrl, getUrls, updateUrl } from '../controllers/url-controller';

const router = express.Router();

router.post('/shorten', createUrl);
router.get('/urls', getUrls);
router.get('/url/:id', getUrl);
router.put('/url/:id', updateUrl);
router.delete('/url/:id', deleteUrl);

export default router;
