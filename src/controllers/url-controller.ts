import { Request, Response } from 'express';

import { createdMsg, notFoundMsg } from '../constants/messages';
import HTTP_STATUS from '../utils/http-status';
import logger from '../logs/logger';
import { convertToHyphenated, generateShortUrl, getUpdateParams } from '../utils/short-url-generator';
import Url from '../models/url';

const BASE_URL = process.env.BASE_URL as string;

//  CREATE A SHORTEN URL FROM A LONG URL
export const createUrl = async (req: Request, res: Response) => {
  try {
    const { url, customName } = req.body;

    const existingUrl = await Url.findOne({
      originalUrl: url,
    });

    if (existingUrl) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Url already exists!' });
    }

    const urlString = generateShortUrl();

    const custom = customName && convertToHyphenated(customName);

    const originalUrl = url;
    const shortUrl = custom ? `${BASE_URL}/${custom}` : `${BASE_URL}/${urlString}`;
    const customNameUrl = custom ? `${custom}` : '';

    const shortenUrl = await Url.create({
      originalUrl,
      shortUrl,
      customName: customNameUrl,
    });

    const data = {
      _id: shortenUrl.id,
      shortUrl: shortenUrl.shortUrl,
    };

    return res.status(HTTP_STATUS.CREATED).json({ message: createdMsg, data });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error adding url' });
  }
};

//  GET ALL THE URLS IN THE DATABASE
export const getUrls = async (req: Request, res: Response) => {
  try {
    const urls = await Url.find();

    if (!urls) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'No url found!' });

    if (urls.length === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'No URL found!' });
    }

    const successResponse = urls.map((url) => ({
      _id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      ...(url.customName ? { customName: url.customName } : {}), // Conditionally add customName
    }));

    return res.status(HTTP_STATUS.OK).send(successResponse);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error getting url' });
  }
};

//  GET A SINGLE URL FROM THE DATABASE
export const getUrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const url = await Url.findById({ _id: id });

    if (!url) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: notFoundMsg });

    const formattedUrl = {
      id: url._id.toString(),
      customName: url.customName || undefined,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt.toISOString(), // Format date to ISO string
    };

    return res.status(HTTP_STATUS.OK).json(formattedUrl);
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error occurred while fetching url' });
  }
};

// UPDATING A SINGLE URL FROM THE DATABASE
export const updateUrl = async (req: Request, res: Response) => {
  const { id, url, customName } = getUpdateParams(req);

  const urlString = generateShortUrl();
  const custom = customName && convertToHyphenated(customName);
  const shortUrl = custom ? `${BASE_URL}/${custom}` : `${BASE_URL}/${urlString}`;
  const customNameUrl = custom ? `${custom}` : '';

  try {
    const existingUrl = await Url.findOne({ _id: id });

    if (!existingUrl) {
      logger.error(notFoundMsg);
      return res.status(404).send({ message: notFoundMsg });
    }

    const updatedUrl = await Url.findOneAndUpdate(
      { _id: id },
      {
        customName: customNameUrl,
        shortUrl,
        originalUrl: url,
      },
    );

    if (updatedUrl?.customName === '' || updatedUrl?.customName === null) {
      const successResponse = {
        id: updatedUrl.id,
        originalUrl: updatedUrl.originalUrl,
        shortUrl: updatedUrl.shortUrl,
        createdAt: updatedUrl.createdAt,
      };
      return res.status(200).send({ message: 'Url updated successfully', successResponse });
    }

    const successResponse = {
      id: updatedUrl?._id,
      originalUrl: updatedUrl?.originalUrl,
      shortUrl: updatedUrl?.shortUrl,
      createdAt: updatedUrl?.createdAt,
      customName: updatedUrl?.customName,
    };

    return res.status(200).send({ message: 'Url updated successfully', successResponse });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error occurred while updating url' });
  }
};

// DELETING A SINGLE URL FROM THE DATABASE
export const deleteUrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingUrl = await Url.findOneAndDelete({ _id: id });

    if (!existingUrl) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: notFoundMsg });

    return res.status(HTTP_STATUS.OK).send({ message: 'Url deleted successfully' });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error occurred while deleting url' });
  }
};
