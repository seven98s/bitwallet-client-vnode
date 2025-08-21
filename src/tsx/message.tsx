import { createApp } from 'vue';
import { styled } from '@styils/vue';

const BigDiv = styled('div', {
	backgroundColor: 'rgba(240, 249, 235, 0.9)',
	borderRadius: '15px',
	position: 'fixed',
	top: '10%',
	right: '50%',
	transform: 'translateX(50%)',
	zIndex: '9999',
});
const TextDiv = styled('div', {
	width: '50vw',
	padding: '5px',
	textAlign: 'center',
	fontSize: '0.7rem',
	color: '#67c23a',
	fontWeight: '600',
});
const MessageBox = {
	props: {
		msg: {
			type: String,
			require: true,
		},
	},
	render(ctx) {
		const { $props } = ctx;
		return (
			<BigDiv>
				<TextDiv>{$props.msg}</TextDiv>
			</BigDiv>
		);
	},
};

/**
 * 消息提示框
 * @param msg 提示文本
 * @param time 展示时间
 */
function showMsg(msg: string = '默认文本', time: number = 1500) {
	const div = document.createElement('div');
	document.body.appendChild(div);
	const app = createApp(MessageBox, {
		msg,
	});
	app.mount(div);
	setTimeout(() => {
		app.unmount();
		div.remove();
	}, time);
}

export default showMsg;
