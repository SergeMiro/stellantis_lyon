import React from 'react';
import './App.css';
import Header from './components/header';

import Footer from './components/footer';
import TableAgents from './components/table_agents';
import FormulaireSra from './components/formulaire_sra';
import Status from './components/status';
//import StatusModule from './components/StatusModule';



function App() {
	return (
		<div className="App">
			<div className='max-w-full py-4 px-6'>
				<Header />


				<FormulaireSra />
				<Status />
				{/* <StatusModule /> */}
				<TableAgents />
				<Footer />
			</div>


		</div>
	);
}

export default App;
