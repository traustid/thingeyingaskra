import Label from "./Label";

function Panel(props) {
	return <div className={'bg-white mb-4 p-6 rounded-md shadow-lg border border-gray-200'+(props.className ? ' '+props.className : '')}>
		{
			props.title && <Label>{props.title}</Label>
		}
		{props.children}
	</div>
}

export default Panel;