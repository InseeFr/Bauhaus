import "./dropdown.scss";
import { useEffect, useRef, useState } from 'react';
import { Button } from '@inseefr/wilco';
import D from 'js/i18n';

const useOutsideClick = (el, initialState) => {
	const [isActive, setIsActive] = useState(initialState);

	useEffect(() => {
		const onClick = (e) => {
			// If the active element exists and is clicked outside of
			if (el.current !== null && !el.current.contains(e.target)) {
				setIsActive(!isActive);
			}
		};

		// If the item is active (ie open) then listen for clicks outside
		if (isActive) {
			window.addEventListener("click", onClick);
		}

		return () => {
			window.removeEventListener("click", onClick);
		};
	}, [isActive, el]);

	return [isActive, setIsActive];
};

const ExportButton = ({ actions, disabled = false }) => {
	const dropdownRef = useRef(null);
	const [open, setOpen] = useOutsideClick(dropdownRef, false);

	const onKeyDown = e => {
		if(open && e.key === "Escape"){
			setOpen(false);
			dropdownRef.current.querySelector("button").focus();
		}
	}
	useEffect(() => {
		if(open){
			dropdownRef.current.querySelector("li *")?.focus();
		}
	}, [open]);


	return (
		<div ref={dropdownRef} onKeyDown={onKeyDown}>
			<Button disabled={disabled} col={12} action={() => setOpen(!open)} label={D.btnExporter} />
			<div

				className={`dropdown__content ${open ? "active" : "inactive"}`}
			>
				<div className="dropdown__info">
					<ul>
						{ actions.map((action, i) => <li key={i}>{action}</li>)}
					</ul>
				</div>
			</div>
		</div>)
}

export default ExportButton
