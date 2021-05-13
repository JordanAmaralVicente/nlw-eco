import React, { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./styles.css";
import logo from "../../assets/logo.svg";
import Point from "../../Types/Point";
import Item from "../../Types/Item";
import axios from "axios";

interface UF{
    sigla: string,
}

interface Cidade{
    nome: string,
}

const ListPoints : React.FC = () => {

	const [pontos, setPontos] = useState<Point[]>([]);
	const [items, setItems] = useState<Item[]>([]);
	const [ufs, setUFState] = useState<string[]>([]);
	const [cities, setCitiesState] = useState<string[]>([]);
	const [selectedUf, setSelectedUf] = useState("0");
	const [selectedCity, setSelectedCity] = useState("0");
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	useEffect(()=>{
		api.get("/points").then( response =>{
			setPontos(response.data);
		});
	}, []);

	useEffect(()=>{
		api.get("/items").then( response =>{
			setItems(response.data);
		});
	}, []);

	useEffect(()=>{
		axios.get<UF[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
			.then(response =>{
				const ufNames = response.data.map(uf => uf.sigla);
				setUFState(ufNames);
			});
	}, );
	useEffect(()=>{
		if(selectedUf !== "0"){
			axios.get<Cidade[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
				.then(response =>{
					const cidades = response.data.map(cidade => cidade.nome);
					setCitiesState(cidades);
				});
		}
	}, [selectedUf]);



	function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
		setSelectedUf(event.target.value);
	}
	function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
		setSelectedCity(event.target.value);
	}

	function handleFilterPoints(){
		const query = "/points?city="+selectedCity+"&uf="+selectedUf+"&items="+ selectedItems;
		console.log(query);
		api.get(query).then( response =>{
			setPontos(response.data);
		});
	}
	function handleSelectItem(id: number){
		console.log(id);

		const alreadySelected = selectedItems.findIndex(item => item === id);
		if(alreadySelected >= 0){
			console.log("already"+id);
			const filteredItems = selectedItems.filter(item => item !== id);
			setSelectedItems(filteredItems);
		}else{
			console.log("not"+id);
			setSelectedItems([...selectedItems, id]);
		}
		console.log(selectedItems);
	}

	return (
		<div id="page-home">
			<div className="content">
				<header>
					<Link to="/">
						<img src={logo} alt="Logotipo ecoleta"/>
					</Link>
				</header>
				<main>
					<form>
						<div className="mb-3 pt-3">
							<label htmlFor="exampleInputEmail1" className="form-label">Estado</label>
							<select name="uf" id="uf" className="form-select" aria-label="Default select example" value={selectedUf} onChange={handleSelectUf}>
								<option value="0">Selecione um Estado</option>
								{
									ufs.map((uf) =>(
										<option key={uf} value={uf}>{uf}</option>
									))
								}
							</select>
						</div>
						<div className="mb-3">
							<label htmlFor="exampleInputPassword1" className="form-label">Cidade</label>
							<select name="city" className="form-select" value={selectedCity} onChange={handleSelectCity} id="city">
								<option value="0">Selecione uma cidade</option>
								{
									cities.map((city) =>(
										<option key={city} value={city}>{city}</option>
									))
								}
							</select>
						</div>
						<div className="mb-3 form-check">
							<p>CheckBox</p>
							{ items.map(item =>{
								return (
									<div key={item.id}>
										<input type="checkbox" onClick={() => handleSelectItem(item.id)} className="form-check-input" id={item.id + ""}/>
										<label className="form-check-label" htmlFor="exampleCheck1">{item.title}</label>
									</div>
								);
							})}
						</div>
						<button type="button" onClick={() => handleFilterPoints()} className="btn btn-primary">Filtrar</button>
					</form>
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