function Label(props) {
	return <div className={'font-bold text-[#267fad] mb-4 text-sm'+(props.className ? ' '+props.className : '')}>{props.children}</div>
}

export default Label;