import { Request, Response } from 'express';
import prisma from '../libs/prisma-client';

import { convertToHyphenated, generateShortUrl } from '../utils/short-url-generator';
import logger from '../logs/logger';

const msg = 'Url successfully fetched';

//  CREATE A SHORTEN URL FROM A LONG URL
export const createUrl = async (req: Request, res: Response) => {
  const { url, customName } = req.body;

  if (!url) return res.status(400).send({ message: 'Url is required!' });
  try {
    const existingUrl = await prisma.url.findFirst({
      where: {
        originalUrl: url,
      },
    });
    if (existingUrl) {
      return res.status(400).send({ message: 'Url already exists!' });
    }

    const urlString = generateShortUrl();

    const custom = customName && convertToHyphenated(customName);

    const originalUrl = url;
    const shortUrl = `https://shortit/${urlString}`;
    const customNameUrl = custom ? `https://shortit/${custom}` : '';

    const shortenUrl = await prisma.url.create({
      data: {
        originalUrl,
        shortUrl,
        customName: customNameUrl,
      },
    });
    return res.status(201).json({ message: msg, shortenUrl });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error adding url' });
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

    if (!url) return res.status(404).send({ message: 'No url found!' });

    return res.status(200).send({
      message: msg,
      result: url.length,
      url,
    });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error getting url' });
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

    return res.status(200).send({ message: msg, url });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error occurred while fetching url' });
  }
};

// UPDATING A SINGLE URL FROM THE DATABASE
export const updateUrl = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { shortUrl, customName } = req.body;

  if (!id) return res.status(404).send({ message: 'Url not found' });
  if (!shortUrl && !customName) return res.status(400).send({ message: 'At least one field should be updated' });

  try {
    const updatedUrl = await prisma.url.update({
      where: {
        id,
      },
      data: {
        shortUrl,
        customName,
      },
    });

    return res.status(200).send({ message: msg, updatedUrl });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error occurred while updating url' });
  }
};

// DELETING A SINGLE URL FROM THE DATABASE
export const deleteUrl = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(404).send({ message: 'Url not found' });

  try {
    await prisma.url.delete({
      where: {
        id,
      },
    });
    return res.status(200).send({ message: msg });
  } catch (error) {
    logger.info(error);
    return res.status(400).send({ message: 'Error while deleting url' });
  }
};
