import { NextFunction, Request, Response } from "express";

export interface IAppRequest extends Request {}

export interface IAppResponse extends Response {}

export interface IAppNextFuction extends NextFunction {}
