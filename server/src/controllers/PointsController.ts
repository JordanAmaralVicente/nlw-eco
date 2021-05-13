/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from "express";
import knex from "../database/connection";
import Item from "./ItemInterface";
import Point from "./PointsInterface";

class PointsController{
	async create (req: Request, res: Response){
		const {
			//image
			name,
			email,
			whatsapp,
			city,
			uf,
			latitude,
			longitude,
			items
		} = req.body;

		const trx = await knex.transaction();
		const point = { 
			image:"fake_image",
			name,
			email,
			whatsapp,
			city,
			uf,
			latitude,
			longitude,
		};
		const insertedIds = await trx("points").insert(point);//retorna array
		const point_id = insertedIds[0];
		const pointItems = items.map((item_id: number) =>{
			return {
				point_id,
				item_id,
			};
		});
		await trx("point_items").insert(pointItems);
		await trx.commit();
		return res.status(200).json({id: point_id, ...point}); 
	}

	async show(req: Request, res: Response){
		const point_id = req.params.id;
		const point = await knex("points").where({id: point_id}).first();
        
		const items = await knex("items")
			.join("point_items", "items.id", "point_items.item_id")
			.where("point_items.point_id", point_id).select("items.title");
        
		return point 
			?res.status(200).json({ point,  items })
			:res.status(404).json({ message:"Couldn't find point" });
	}

	async index(req: Request, res: Response){
		const { city, uf, items } = req.query;
		
		if(city && uf && items){
			console.log("city: " + city +" uf: " + uf + " items" + items);
			const parsedItems = String(items).split(/, |,/g).map(item =>(Number(item.trim())));
			const points = await knex("point_items")
				.join("points", "point_items.point_id","=" ,"points.id" )
				.whereIn("point_items.item_id", [...parsedItems])
				.where("city", String(city))
				.where("uf", String(uf))
				.distinct()
				.select("points.*");
			
			const db_items = await knex("items")
				.select("*")
				.join("point_items", "items.id", "point_items.item_id");

			const finalPoints = points.map((point)=>{
				const point_items = db_items.filter(item =>(
					item.point_id === point.id
				));
				const parsedItems = point_items.map(item => {
					const {id, image, title} = item;
					const obj : Item = {
						id, image, title
					};
					return obj; 
				});
				point.items = [];
				point.items.push(...parsedItems);
				return point;
			});

			return res.status(200).send(finalPoints);
		}else{
			const points : Point[] = await knex("points")
				.select("*")
				.distinct();
			const items = await knex("items")
				.select("*")
				.join("point_items", "items.id", "point_items.item_id");

			const finalPoints = points.map((point)=>{
				const point_items = items.filter(item =>(
					item.point_id === point.id
				));
				const parsedItems = point_items.map(item => {
					const {id, image, title} = item;
					const obj : Item = {
						id, image, title
					};
					return obj; 
				});
				point.items = [];
				point.items.push(...parsedItems);
				return point;
			});

			return res.status(200).send(finalPoints);
		}
	}
}

export default PointsController;