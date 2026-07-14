import { NavLink } from "react-router";
import _ from 'underscore';
import Label from "./Label";

function PersonLink(props) {
	if (props.item && !props.item.person) {
		return <div className="flex flex-wrap border-b border-gray-300 py-2">
			<div className="font-bold w-1/2">{props.item.name}</div>
		</div>
	}
	if (props.item && props.item.person) {
		return <NavLink className="md:flex flex-wrap py-2 px-4 rounded hover:bg-gray-100/40 border-b border-gray-200 border-t border-t-transparent hover:border-t-gray-200 hover:border hover:shadow-md transition-all group" to={'/einstaklingar/'+props.item._id}>

			<div className="md:w-1/2">
				{
					props.headerText && <Label>
						{props.headerText}
					</Label>
				}
				<div className="font-bold group-hover:underline">
					{props.item.person.name}
				</div>
				<div className="text-sm">
					{props.item.person.birth ? props.item.person.birth.original_string : ''}{' - '}
					{props.item.person.death ? props.item.person.death.original_string : ''}
				</div>
			</div>

			<div className="md:w-1/2">
				{
					props.item.spouse && props.item.spouse.length > 0 &&
					<div className="text-sm mt-1"><span className="font-bold text-gray-500">Maki:</span> {props.item.spouse.map(p => p.name).join(', ')}</div>
				}
				{
					props.item.parents && props.item.parents.length > 0 &&
					<div className="text-sm mt-1"><span className="font-bold text-gray-500">Foreldrar:</span> {props.item.parents.map(p => p.name).join(', ')}</div>
				}
			</div>

			{
				props.item.residence_history && <div className="w-full mt-2">
				<div className="text-sm">
					{
						_.uniq(props.item.residence_history.map(item => item.location_obj ? item.location_obj.name : item.location || null)).join(', ')
					}
				</div>
			</div>
			}

		</NavLink>
	}
}

export default PersonLink;