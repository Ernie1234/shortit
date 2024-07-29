import { Request, Response } from 'express';
import logger from '../logs/logger';
import prisma from '../libs/prisma-client';

const msg = 'Url successfully fetched';

//  CREATE A SHORTEN URL FROM A LONG URL
export const createUrl = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) return res.status(400).send({ message: 'Url is required!' });
  try {
    return res.status(201).json({ message: msg });
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
