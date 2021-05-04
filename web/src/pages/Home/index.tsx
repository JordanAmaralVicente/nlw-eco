import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import "./styles.css";
import logo from '../../assets/logo.svg';

const Home : React.FC = ()=>{
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Logotipo" />
                </header>
                <main>
                    <h1>Ecoleta, para coleta de resíduos</h1>
                    <p>Ajudando a encontrar pontos de coleta
                        de forma eficiente
                    </p>
                    <Link to="/create-point">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;