import React from "react";

import { VertDots } from "components/common/icons";

import { Tooltip } from "components/common/styled-components";

import styled from "styled-components";

import DraggableModal from "components/AvlStuff/DraggableModal";

const ModalWrapper = styled.div`
	${props => props.theme.scrollBar};

{/*Very light gray - d9d9d9
Light gray - 999999 (attribute button color)
Gray- 5d5c5c 
darker gray --2e2e2e ( land color) 
More darker gray-- 242424 (ocean color) 
Darker -131313

Dark Blue- 293145 ( header color)*/}


	background-color: #2e2e2e /*${props => props.theme.panelBackground}*/;   
	display: inline-flex;
	position: relative;
	pointer-events: all;
	padding: 0px 20px 20px 20px;
	overflow: auto;
	width: 100%;
	height: 100%;
`;

const ModalTitle = styled.div`
	display: block;
	position: absolute;
	top: 10px;
	left: 40px;
	font-size: 1rem;
	color: ${props => props.theme.textColorHl};
`;

class MapModal extends React.Component {
	MODAL_ID = undefined;
	close(e, { layerName, modalName }) {
		e.preventDefault();
		e.stopPropagation();
		this.props.toggleModal(layerName, modalName);
	}
	render() {
		const modal = this.props.layers.reduce((a, layer) => {
			let m = null;
			if (layer.modals) {
				for (const key in layer.modals) {
					if (layer.modals[key].show) {
						m = {
							...layer.modals[key],
							id: `${layer.name}-${key}`,
							layerName: layer.name,
							modalName: key,
							props: layer.modals[key].props || {},
							layer,
							startSize: layer.modals[key].startSize || [
								1600,
								1000
							],
							startPos: layer.modals[key].position || "bottom"
						};
					}
				}
			}
			return m || a;
		}, {});

		Boolean(modal.comp) && (this.MODAL_ID = modal.id);

		return (
			<DraggableModal
				show={Boolean(modal.comp)}
				onClose={e => this.close(e, modal)}
				meta={{
					id: this.MODAL_ID,
					startSize: modal.startSize,
					startPos: modal.startPos
				}}
				resizeOnIdChange={true}
			>
				{modal.title && <ModalTitle>{modal.title}</ModalTitle>}
				<ModalWrapper>
					{!Boolean(modal.comp) ? null : (
						<modal.comp {...modal.props} layer={modal.layer} />
					)}
				</ModalWrapper>
			</DraggableModal>
		);
	}
}

export default MapModal;
