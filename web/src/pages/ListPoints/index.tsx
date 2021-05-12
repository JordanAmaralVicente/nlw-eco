import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./styles.css";
import logo from "../../assets/logo.svg";
import Point from "../../Types/Point";

const ListPoints : React.FC = () => {

	const [pontos, setPontos] = useState<Point[]>([]);

	useEffect(()=>{
		api.get("/points").then( response =>{
			setPontos(response.data);
		});
	}, []);

	return (
		<div id="page-home">
			<div className="content">
				<header>
					<Link to="/">
						<img src={logo} alt="Logotipo ecoleta"/>
					</Link>
				</header>
				<main>
					<div className="list-points">
						{
							pontos.map((ponto)=>{
								const {items} = ponto;
								return(
									<div key={ponto.id} className="point">
										<p>{ponto.name}</p>
										<p>{ponto.email}</p>
										<p>{ponto.whatsapp}</p>
										<p>{ponto.uf}</p>
										<p>{ponto.city}</p>
										<div>
											{items.map((item) =>{
												return (
													<div key={item.id}>
														<p>{item.title}</p>
														<img src={"http://localhost:3001/uploads/"+ item.image}/>
													</div>
												);
											})}
										</div>
									</div>
								);
							})
						}
					</div>
				</main>
			</div>
		</div>
	);
};

export default ListPoints;