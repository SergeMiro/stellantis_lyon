import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import moment from 'moment';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { callSAMWebService } from '../backend/API/sam';  

const StatusModule = ({ idStatusGroup, contextCampaign = '', idStatus = 0, idSubStatus = 0, recallDate = '', icons = '', categories = '' }) => {
	const [statusList, setStatusList] = useState([]);
	const [subStatusList, setSubStatusList] = useState([]);

	useEffect(() => {
		$('#refresh_cti_status').on('click', () => {
			setStatus();
			fetchStatusList(idStatusGroup, contextCampaign);
		});
		fetchStatusList(idStatusGroup, contextCampaign);
		setStatus(idStatus);
		setSubStatus(idSubStatus);
		setRecallDate(recallDate);

		// Hide recall date input by default
		$('#cti_status_recall').hide();
		$('label[for="cti_status_recall"]').hide();
	}, [idStatusGroup, contextCampaign, idStatus, idSubStatus, recallDate]);

	const fetchStatusList = async (idStatusGroup, contextCampaign) => {
		// Show spinner and hide refresh icon
		$("#refresh_cti_status").addClass("hidden");
		$("#cti_status_spinner").removeClass("hidden");

		const select = $('#cti_status');
		select.prop('disabled', true);

		try {
			const statusList = await callSAMWebService('getCtiStatus', { idStatusGroup });
			setStatusList(Object.values(statusList).filter(status => status.active == '1' && status.configuration_script_campaign_context.includes(contextCampaign)).sort((a, b) => a.display_order - b.display_order));
		} catch (error) {
			console.error('fetchStatusList: no status received');
		}

		select.empty();
		if (statusList.length) {
			select.append(new Option());
			statusList.forEach(status => {
				const option = new Option(status.label, status.number);
				select.append(option);
			});
			select.prop('disabled', false);
		}

		// Hide spinner and show refresh icon
		$("#refresh_cti_status").removeClass("hidden");
		$("#cti_status_spinner").addClass("hidden");
	};

	const setStatus = (idStatus = 0) => {
		$('#cti_status').val(idStatus);
		setSubStatus();
		fetchSubStatusList();
		if (idStatus == 94 || idStatus == 95) {
			$('#cti_status_recall').show();
			$('label[for="cti_status_recall"]').show();
		} else {
			$('#cti_status_recall').hide();
			$('label[for="cti_status_recall"]').hide();
		}
	};

	const fetchSubStatusList = () => {
		const status = statusList.find(status => status.number == $('#cti_status').val()) || '';
		if (status) {
			setSubStatusList(Object.values(status.substatus).filter(subStatus => subStatus.active == '1').sort((a, b) => a.display_order - b.display_order));
		} else {
			setSubStatusList([]);
		}

		const select = $('#cti_substatus');
		select.prop('disabled', true);
		select.empty();
		if (subStatusList.length) {
			select.append(new Option());
			subStatusList.forEach(subStatus => {
				const option = new Option(subStatus.label, subStatus.number);
				select.append(option);
			});
			select.prop('disabled', false);
		}
	};

	const setSubStatus = (idSubStatus) => {
		$('#cti_substatus').val(idSubStatus);
	};

	const setRecallDate = (dateRecall = '') => {
		$('#cti_status_recall').val(dateRecall);
	};

	return (
		<div className="bg-white shadow-md rounded-md p-4 mb-4" noValidate>
			<h6 id="cti_status_title" className="text-xl font-semibold mb-4">Qualification fiche</h6>
			<div className="space-y-4">
				<div>
					<div className="flex items-center">
						<label htmlFor="cti_status" className="mr-2">Status</label>
						<ArrowPathIcon id="refresh_cti_status" className="h-5 w-5 text-gray-500 cursor-pointer" />
						<ArrowPathIcon id="cti_status_spinner" className="h-5 w-5 text-gray-500 hidden animate-spin" />
					</div>
					<select id="cti_status" className="w-full mt-1 p-2 border border-gray-300 rounded" disabled></select>
					<div className="text-red-600 text-sm mt-1"></div>
				</div>
				<div>
					<label htmlFor="cti_substatus" className="block mt-2">Substatus</label>
					<select id="cti_substatus" className="w-full mt-1 p-2 border border-gray-300 rounded" disabled></select>
					<div className="text-red-600 text-sm mt-1"></div>
				</div>
				<div>
					<label htmlFor="cti_status_recall" className="block mt-2">Recall date</label>
					<input id="cti_status_recall" type="datetime-local" className="w-full mt-1 p-2 border border-gray-300 rounded" />
					<div className="text-red-600 text-sm mt-1"></div>
				</div>
				<div>
					<label htmlFor="sam_qualification" className="block mt-2">Qualification</label>
					<select id="sam_qualification" className="w-full mt-1 p-2 border border-gray-300 rounded">
						<option selected></option>
						<option value="Answered">Respondido</option>
						<option value="Message">Mensaje</option>
						<option value="Transferred">Transferido</option>
					</select>
					<div className="text-red-600 text-sm mt-1"></div>
				</div>
				<div>
					<label htmlFor="sam_category" className="block mt-2">Catégorie</label>
					<select id="sam_category" className="w-full mt-1 p-2 border border-gray-300 rounded"></select>
					<div className="text-red-600 text-sm mt-1"></div>
				</div>
				<div>
					<label htmlFor="sam_icons" className="block mt-2">Icons</label>
					<select id="sam_icons" className="w-full mt-1 p-2 border border-gray-300 rounded" multiple></select>
					<div className="text-red-600 text-sm mt-1"></div>
				</div>
				<div className="mt-2">
					<input id="sam_urgence" className="form-check-input ml-1" type="checkbox" />
					<label htmlFor="sam_urgence" className="ml-2">Urgent</label>
				</div>
				<div className="mt-4">
					<button id="btn_statuer" className="bg-blue-500 text-white w-full p-2 rounded">Statuer</button>
				</div>
			</div>
		</div>
	);
};

export default StatusModule;
