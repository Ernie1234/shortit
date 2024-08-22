import { Request, Response } from 'express';
import prisma from '../libs/prisma-client';

import { createdMsg, notFoundMsg, successMsg } from '../constants/messages';
import HTTP_STATUS from '../utils/http-status';
import logger from '../logs/logger';
import { convertToHyphenated, generateShortUrl } from '../utils/short-url-generator';

const BASE_URL = process.env.BASE_URL as string;

//  CREATE A SHORTEN URL FROM A LONG URL
export const createUrl = async (req: Request, res: Response) => {
  try {
    const { url, customName } = req.body;

    const existingUrl = await prisma.url.findFirst({
      where: {
        originalUrl: url,
      },
    });
    if (existingUrl) {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Url already exists!' });
    }

    const urlString = generateShortUrl();

    const custom = customName && convertToHyphenated(customName);

    const originalUrl = url;
    const shortUrl = custom ? `${BASE_URL}/${custom}` : `${BASE_URL}/${urlString}`;
    const customNameUrl = custom ? `${custom}` : '';

    const shortenUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortUrl,
        customName: customNameUrl,
      },
    });

    const data = {
      id: shortenUrl.id,
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
    const urls = await prisma.url.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!urls) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'No url found!' });

    const successResponse = urls.map((url) => {
      if (url.customName === '' || url.customName === null) {
        return {
          id: url.id,
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          createdAt: url.createdAt,
        };
      }
      return {
        id: url.id,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        createdAt: url.createdAt,
        customName: url.customName,
      };
    });

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
    const url = await prisma.url.findUnique({
      where: {
        id,
      },
    });

    if (!url) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: notFoundMsg });

    return res.status(HTTP_STATUS.OK).send({ message: successMsg, url });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error occurred while fetching url' });
  }
};

// UPDATING A SINGLE URL FROM THE DATABASE
export const updateUrl = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { url, customName } = req.body;

  if (!id) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: notFoundMsg });
  if (!url && !customName) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'At least one field should be updated' });
  }

  const custom = customName && convertToHyphenated(customName);
  const shortUrl = `${BASE_URL}/${custom}`;

  try {
    const existingUrl = await prisma.url.findUnique({
      where: {
        id,
      },
    });

    if (!existingUrl || existingUrl?.originalUrl !== url) {
      return res.status(404).send({ message: notFoundMsg });
    }

    const updatedUrl = await prisma.url.update({
      where: {
        id,
      },
      data: {
        customName: custom,
        shortUrl,
      },
    });

    const data = {
      id: updatedUrl.id,
      shortUrl: updatedUrl.shortUrl,
      customName: updatedUrl.customName,
      createdAt: updatedUrl.createdAt,
      originalUrl: updatedUrl.originalUrl,
    };

    return res.status(200).send({ message: 'Url updated successfully', data });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error occurred while updating url' });
  }
};

// DELETING A SINGLE URL FROM THE DATABASE
export const deleteUrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingUrl = await prisma.url.findUnique({
      where: {
        id,
      },
    });

    if (!existingUrl) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: notFoundMsg });

    await prisma.url.delete({
      where: {
        id,
      },
    });
    return res.status(HTTP_STATUS.OK).send({ message: 'Url deleted successfully' });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Error occurred while deleting url' });
  }
};
