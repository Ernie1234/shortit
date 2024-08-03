import { Request, Response } from 'express';
import prisma from '../libs/prisma-client';

import { convertToHyphenated, generateShortUrl } from '../utils/short-url-generator';
import logger from '../logs/logger';
import HTTP_STATUS from '../utils/http-status';

const successMsg = 'Url successfully fetched';
const notFoundMsg = 'No Url found!';

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
    const shortUrl = custom ? `https://shortit/${custom}` : `https://shortit/${urlString}`;
    const customNameUrl = custom ? `${custom}` : '';

    const shortenUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortUrl,
        customName: customNameUrl,
      },
    });
    return res.status(HTTP_STATUS.CREATED).json({ message: successMsg, shortenUrl });
  } catch (error) {
    logger.info(error);
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Error adding url' });
  }
};

//  GET ALL THE URLS IN THE DATABASE
export const getUrls = async (req: Request, res: Response) => {
  try {
    const url = await prisma.url.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!url) return res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'No url found!' });

    return res.status(HTTP_STATUS.OK).send({
      message: successMsg,
      result: url.length,
      url,
    });
  } catch (error) {
    logger.info(error);
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Error getting url' });
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

    if (!url) return res.status(404).send({ message: notFoundMsg });

    return res.status(200).send({ message: successMsg, url });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error occurred while fetching url' });
  }
};

// UPDATING A SINGLE URL FROM THE DATABASE
export const updateUrl = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { url, customName } = req.body;

  if (!id) return res.status(404).send({ message: notFoundMsg });
  if (!url && !customName) return res.status(400).send({ message: 'At least one field should be updated' });

  const custom = customName && convertToHyphenated(customName);
  const shortUrl = `https://shortit/${custom}`;

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

    return res.status(200).send({ message: 'Url updated successfully', updatedUrl });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error occurred while updating url' });
  }
};

// DELETING A SINGLE URL FROM THE DATABASE
export const deleteUrl = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(404).send({ message: notFoundMsg });

  try {
    const existingUrl = await prisma.url.findUnique({
      where: {
        id,
      },
    });

    if (!existingUrl) return res.status(404).send({ message: notFoundMsg });

    await prisma.url.delete({
      where: {
        id,
      },
    });
    return res.status(200).send({ message: 'Url deleted successfully' });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error while deleting url' });
  }
};
