window.customCards = window.customCards || [];
window.customCards.push({
	type: "four-speed-fan-button-row",
	name: "four speed fan button row",
	description: "A plugin to display your Four speed fan controls in a button row.",
	preview: false,
});

class CustomFourSpeedFanRow extends Polymer.Element {

	static get template() {
		return Polymer.html`
			<style is="custom-style" include="iron-flex iron-flex-alignment"></style>
			<style>
				:host {
					line-height: inherit;
				}
				.percentage {
					margin-left: 2px;
					margin-right: 2px;
					background-color: #759aaa;
					border: 1px solid lightgrey; 
					border-radius: 4px;
					font-size: 10px !important;
					color: inherit;
					text-align: center;
					float: right !important;
					padding: 1px;
					cursor: pointer;
				}
				
				</style>
					<hui-generic-entity-row hass="[[hass]]" config="[[_config]]">
						<div class='horizontal justified layout' on-click="stopPropagation">
							<button
								class='percentage'
								style='[[_leftColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideLeft]]'
								toggles name="[[_leftName]]"
								on-click='setPercentage'
								disabled='[[_leftState]]'>[[_leftText]]</button>
							<button
								class='percentage'
								style='[[_midLeftColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideMidLeft]]'
								toggles name="[[_midLeftName]]"
								on-click='setPercentage'
								disabled='[[_midLeftState]]'>[[_midLeftText]]</button>
							<button
								class='percentage'
								style='[[_midColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideMid]]'
								toggles name="[[_midName]]"
								on-click='setPercentage'
								disabled='[[_midState]]'>[[_midText]]</button>
							<button
								class='percentage'
								style='[[_midRightColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideMidRight]]'
								toggles name="[[_midRightName]]"
								on-click='setPercentage'
								disabled='[[_midRightState]]'>[[_midRightText]]</button>
							<button
								class='percentage'
								style='[[_rightColor]];min-width:[[_width]];max-width:[[_width]];height:[[_height]];[[_hideRight]]'
								toggles name="[[_rightName]]"
								on-click='setPercentage'
								disabled='[[_rightState]]'>[[_rightText]]</button>
						</div>
					</hui-generic-entity-row>
		`;
	}

	static get properties() {
		return {
			hass: {
				type: Object,
				observer: 'hassChanged'
			},
			_config: Object,
			_stateObj: Object,
			_offSP: Number,
			_lowSP: Number,
			_medSP: Number,
			_highSP: Number,
			_width: String,
			_height: String,
			_leftColor: String,
			_midLeftColor: String,
			_midRightColor: String,
			_rightColor: String,
			_leftText: String,
			_midLeftText: String,
			_midRightText: String,
			_rightText: String,
			_leftName: String,
			_midLeftName: String,
			_midRightName: String,
			_rightName: String,
			_hideLeft: String,
			_hideMidLeft: String,
			_hideMidRight: String,
			_hideRight: String,
			_leftState: Boolean,
			_midLeftState: Boolean,
			_midRightState: Boolean,
			_rightState: Boolean,

		}
	}

	setConfig(config) {
		this._config = config;

		this._config = {
			customTheme: false,
			customSetpoints: false,
			reverseButtons: false,
			isTwoSpeedFan: false,
			isThreeSpeedFan: false,
			hideOff: false,
			sendStateWithSpeed: false,
			allowDisablingButtons: true,
			offPercentage: 0,
			lowPercentage: 25,
			medLowPercentage: 50,
			medPercentage: 75,
			hiPercentage: 100,
			width: '30px',
			height: '30px',
			isOffColor: '#f44c09',
			isOnLowColor: '#43A047',
			isOnMedLowColor: '#43A047',
			isOnMedColor: '#43A047',
			isOnHiColor: '#43A047',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			customLowText: 'LOW',
			customMedLowText: 'MED LOW',
			customMedText: 'MED',
			customHiText: 'HIGH',
			...config
		};
	}

	hassChanged(hass) {

		const config = this._config;
		const stateObj = hass.states[config.entity];
		const custTheme = config.customTheme;
		const revButtons = config.reverseButtons;
		const twoSpdFan = config.isTwoSpeedFan;
		const threeSpdFan = config.isThreeSpeedFan;
		const hide_Off = config.hideOff;
		const sendStateWithSpeed = config.sendStateWithSpeed;
		const allowDisable = config.allowDisablingButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const OnLowClr = config.isOnLowColor;
		const OnMedLowClr = config.isOnMedLowColor;
		const OnMedClr = config.isOnMedColor;
		const OnHiClr = config.isOnHiColor;
		const OffClr = config.isOffColor;
		const buttonOffClr = config.buttonInactiveColor;
		const OffSetpoint = config.offPercentage;
		const LowSetpoint = config.lowPercentage;
		const MedLowSetpoint = config.medLowPercentage;
		const MedSetpoint = config.medPercentage;
		const HiSetpoint = config.hiPercentage;
		const custOffTxt = config.customOffText;
		const custLowTxt = config.customLowText;
		const custMedLowTxt = config.customMedLowText;
		const custMedTxt = config.customMedText;
		const custHiTxt = config.customHiText;

		let offSetpoint;
		let lowSetpoint;
		let medLowSetpoint;
		let medSetpoint;
		let hiSetpoint;
		let low;
		let medlow;
		let med;
		let high;
		let offstate;

		offSetpoint = parseInt(OffSetpoint);
		medSetpoint = parseInt(MedSetpoint);
		medLowSetpoint = parseInt(MedLowSetpoint);
		if (parseInt(LowSetpoint) < 1) {
			lowSetpoint = 1;
		} else {
			lowSetpoint = parseInt(LowSetpoint);
		}
		if (parseInt(HiSetpoint) > 100) {
			hiSetpoint = 100;
		} else {
			hiSetpoint = parseInt(HiSetpoint);
		}
		if (stateObj && stateObj.attributes) {
			if (stateObj.state == 'on' && stateObj.attributes.percentage > offSetpoint && stateObj.attributes.percentage <= lowSetpoint) {
				low = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > lowSetpoint && stateObj.attributes.percentage <= medLowSetpoint) {
				medlow = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > medLowSetpoint && stateObj.attributes.percentage <= medSetpoint) {
				med = 'on';
			} else if (stateObj.state == 'on' && stateObj.attributes.percentage > medSetpoint && stateObj.attributes.percentage <= hiSetpoint) {
				high = 'on';
			} else {
				offstate = 'on';
			}
		}

		let lowcolor;
		let medlowcolor;
		let medcolor;
		let hicolor;
		let offcolor;


		if (custTheme) {
			if (low == 'on') {
				lowcolor = 'background-color:' + OnLowClr;
			} else {
				lowcolor = 'background-color:' + buttonOffClr;
			}
			if (medlow == 'on') {
				medlowcolor = 'background-color:' + OnMedLowClr;
			} else {
				medlowcolor = 'background-color:' + buttonOffClr;
			}
			if (med == 'on') {
				medcolor = 'background-color:' + OnMedClr;
			} else {
				medcolor = 'background-color:' + buttonOffClr;
			}
			if (high == 'on') {
				hicolor = 'background-color:' + OnHiClr;
			} else {
				hicolor = 'background-color:' + buttonOffClr;
			}
			if (offstate == 'on') {
				offcolor = 'background-color:' + OffClr;
			} else {
				offcolor = 'background-color:' + buttonOffClr;
			}
		} else {
			if (low == 'on') {
				lowcolor = 'background-color: var(--switch-checked-color)';
			} else {
				lowcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (medlow == 'on') {
				medlowcolor = 'background-color: var(--switch-checked-color)';
			} else {
				medlowcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (med == 'on') {
				medcolor = 'background-color: var(--switch-checked-color)';
			} else {
				medcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (high == 'on') {
				hicolor = 'background-color: var(--switch-checked-color)';
			} else {
				hicolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (offstate == 'on') {
				offcolor = 'background-color: var(--switch-checked-color)';
			} else {
				offcolor = 'background-color: var(--switch-unchecked-color)';
			}
		}

		let offtext = custOffTxt;
		let lowtext = custLowTxt;
		let medlowtext = custMedLowTxt;
		let medtext = custMedTxt;
		let hitext = custHiTxt;

		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;

		let offname = 'off'
		let lowname = 'low'
		let medlowname = 'medium-low'
		let medname = 'medium'
		let hiname = 'high'

		let hideoff = 'display:block';
		let hidemedlow = 'display:block';
		let hidemedium = 'display:block';
		let nohide = 'display:block';

		if (twoSpdFan) {
			hidemedium = 'display:none';
			hidemedlow = 'display:none';
		}

		if (threeSpdFan) {
			hidemedlow = 'display:none';
		}

		if (hide_Off) {
			hideoff = 'display:none';
		} else {
			hideoff = 'display:block';
		}

		if (revButtons) {
			this.setProperties({
				_stateObj: stateObj,
				_leftState: (offstate == 'on' && allowDisable),
				_midLeftState: (low === 'on' && allowDisable),
				_midState: (medlow === 'on' && allowDisable),
				_midRightState: (med === 'on' && allowDisable),
				_rightState: (high === 'on' && allowDisable),
				_width: buttonwidth,
				_height: buttonheight,
				_leftColor: offcolor,
				_midLeftColor: lowcolor,
				_midColor: medlowcolor,
				_midRightColor: medcolor,
				_rightColor: hicolor,
				_offSP: offSetpoint,
				_lowSP: lowSetpoint,
				_medSP: medSetpoint,
				_medLowSP: medLowSetpoint,
				_highSP: hiSetpoint,
				_leftText: offtext,
				_midLeftText: lowtext,
				_midText: medlowtext,
				_midRightText: medtext,
				_rightText: hitext,
				_leftName: offname,
				_midLeftName: lowname,
				_midName: medlowname,
				_midRightName: medname,
				_rightName: hiname,
				_hideLeft: hideoff,
				_hideMidLeft: nohide,
				_hideMid: hidemedlow,
				_hideMidRight: hidemedium,
				_hideRight: nohide,
			});
		} else {
			this.setProperties({
				_stateObj: stateObj,
				_leftState: (high == 'on' && allowDisable),
				_midLeftState: (med === 'on' && allowDisable),
				_midState: (medlow === 'on' && allowDisable),
				_midRightState: (low === 'on' && allowDisable),
				_rightState: (offstate === 'on' && allowDisable),
				_width: buttonwidth,
				_height: buttonheight,
				_leftColor: hicolor,
				_midLeftColor: medcolor,
				_midColor: medlowcolor,
				_midRightColor: lowcolor,
				_rightColor: offcolor,
				_offSP: offSetpoint,
				_lowSP: lowSetpoint,
				_medSP: medSetpoint,
				_medLowSP: medLowSetpoint,
				_highSP: hiSetpoint,
				_leftText: hitext,
				_midLeftText: medtext,
				_midText: medlowtext,
				_midRightText: lowtext,
				_rightText: offtext,
				_leftName: hiname,
				_midLeftName: medname,
				_midName: medlowname,
				_midRightName: lowname,
				_rightName: offname,
				_hideRight: hideoff,
				_hideMidRight: nohide,
				_hideMid: hidemedlow,
				_hideMidLeft: hidemedium,
				_hideLeft: nohide
			});
		}
	}

	stopPropagation(e) {
		e.stopPropagation();
	}

	setPercentage(e) {
		const level = e.currentTarget.getAttribute('name');
		const param = { entity_id: this._config.entity };
		if (level == 'off') {
			this.hass.callService('fan', 'turn_off', param);
			param.percentage = this._offSP;
			this.hass.callService('fan', 'set_percentage', param);
		} else if (level == 'low') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._lowSP });
			} else {
				param.percentage = this._lowSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == 'medium-low') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._medLowSP });
			} else {
				param.percentage = this._medLowSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == 'medium') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._medSP });
			} else {
				param.percentage = this._medSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		} else if (level == 'high') {
			if (this._config.sendStateWithSpeed) {
				this.hass.callService('fan', 'turn_on', { entity_id: this._config.entity, percentage: this._highSP });
			} else {
				param.percentage = this._highSP;
				this.hass.callService('fan', 'set_percentage', param);
			}
		}
	}
}

customElements.define('four-speed-fan-button-row', CustomFourSpeedFanRow);

