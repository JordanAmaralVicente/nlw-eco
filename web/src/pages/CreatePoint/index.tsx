import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";

import api from "../../services/api";
import logo from "../../assets/logo.svg";
import "./styles.css";

interface Item{
    id: number,
    image_url: string,
    title: string,
}

interface UF{
    sigla: string,
}

interface Cidade{
    nome: string,
}

const CreatePoint:React.FC = ()=>{
	const history = useHistory();
    
	const [items, setItemsState] = useState<Item[]>([]);
	const [ufs, setUFState] = useState<string[]>([]);
	const [cities, setCitiesState] = useState<string[]>([]);
	const [selectedUf, setSelectedUf] = useState("0");
	const [selectedCity, setSelectedCity] = useState("0");
	const [formInputData, setFormInputData] = useState({
		name: "",
		email: "",
		whatsapp:"",
	});
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

	useEffect(()=>{
		api.get("/items").then( response =>{
			setItemsState(response.data);
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


	async function handleSubmit(event: FormEvent){
		event.preventDefault();

		if(selectedUf !== "0" && selectedCity !== "0" && selectedItems.length != 0){
			const { name, email, whatsapp } = formInputData;
			const uf = selectedUf;
			const city = selectedCity;
			const [ latitude, longitude ] = selectedPosition;
			const items = selectedItems;
	
	
			const data = {
				name,
				email,
				whatsapp,
				uf,
				city,
				latitude,
				longitude,
				items
			};
			await api.post("/points", data);
			history.push("/");
		}else{
			alert("Você presica selecionar todos campos");
		}
		
	}
	function handleSelectItem(id: number){
		const alreadySelected = selectedItems.findIndex(item => item === id);
		if(alreadySelected >= 0){
			const filteredItems = selectedItems.filter(item => item !== id);
			setSelectedItems(filteredItems);
		}else{
			setSelectedItems([...selectedItems, id]);
		}
	}
	function handleInputChange(event: ChangeEvent<HTMLInputElement>){
		const {name, value} = event.target;
		setFormInputData({ ...formInputData, [name]: value });
	}
	function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
		setSelectedUf(event.target.value);
	}
	function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
		setSelectedCity(event.target.value);
	}
	function LocationEventComponent() {
		useMapEvents({
			click: (e) => {
				const { lat, lng } = e.latlng;
				setSelectedPosition([lat, lng]);
			},
		});
		return null;
	}

	return (
		<div id="page-create-point">
			<header>
				<img src={logo} alt="Logotipo ecoleta"/>
				<Link to="/">
					<FiArrowLeft />
                    Voltar para Home page
				</Link>
			</header>
			<form onSubmit={handleSubmit}>
				<h1>Cadastro do Ponto de Coleta</h1>
				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>
					<div className="field">
						<label htmlFor="name">Nome da Entidade</label>
						<input type="text" name="name" id="name" onChange={handleInputChange} required/>
					</div>
					<div className="field-group">
						<div className="field">
							<label htmlFor="email">E-mail</label>
							<input type="email" name="email" id="email" onChange={handleInputChange} required/>
						</div>
						<div className="field">
							<label htmlFor="whatsapp">Whatsapp</label>
							<input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} required/>
						</div>
					</div>
				</fieldset>
				<fieldset>
					<legend>
						<h2>Endereço</h2>
						<span>Selecione o endereço no mapa</span>
					</legend>
					<MapContainer
						center={{ lat: -23.5557432, lng: -46.6369666 }}
						zoom={8}>
						<TileLayer
							attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<LocationEventComponent />
						<Marker position={selectedPosition}/>
					</MapContainer>
					<div className="field-group">
						<div className="field">
							<label htmlFor="uf">UF</label>
							<select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
								<option value="0">Selecione um Estado</option>
								{
									ufs.map((uf) =>(
										<option key={uf} value={uf}>{uf}</option>
									))
								}
							</select>
						</div>
						<div className="field">
							<label htmlFor="city">Cidade</label>
							<select name="city" value={selectedCity} onChange={handleSelectCity} id="city">
								<option value="0">Selecione uma cidade</option>
								{
									cities.map((city) =>(
										<option key={city} value={city}>{city}</option>
									))
								}
							</select>
						</div>
					</div>
				</fieldset>
				<fieldset>
					<legend>
						<h2>Ítens</h2>
						<span>Selecione um ou mais itens abaixo</span>
					</legend>
					<ul className="items-grid">
						{
							items.map((item) =>(
								<li 
									key={item.id} 
									onClick={() => handleSelectItem(item.id)}
									className={selectedItems.includes(item.id) ? "selected" : ""}>
									<img src={item.image_url} alt={item.title}/>
									<span>{item.title}</span>
								</li>
							))
						}
					</ul>
				</fieldset>
				<button type="submit">
                    Cadastrar ponto
				</button>
			</form>
		</div>
	);
};

export default CreatePoint;