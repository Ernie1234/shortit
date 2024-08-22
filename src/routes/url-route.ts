import express from 'express';

import { createUrl, deleteUrl, getUrl, getUrls, updateUrl } from '../controllers/url-controller';
import { validatePostUrl, validateUpdateUrl } from '../middlewares/url-validator';

const router = express.Router();

router.post('/shorten', validatePostUrl, createUrl);
router.get('/urls', getUrls);
router.get('/urls/:id', getUrl);
router.put('/urls/:id', validateUpdateUrl, updateUrl);
router.delete('/urls/:id', deleteUrl);

export default router;
