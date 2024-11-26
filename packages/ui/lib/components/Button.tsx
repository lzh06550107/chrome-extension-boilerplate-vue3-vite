import { defineComponent, h, type PropType } from 'vue';
import { cn } from '../utils';

type Theme = 'light' | 'dark';

export const Button = defineComponent({
  name: 'ButtonDemo',
  props: {
    theme: {
      type: String as PropType<Theme | null>,
      default: 'light',
    },
    className: {
      type: String,
      default: '',
    },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () => (
      <button
        class={cn(
          props.className,
          'py-1 px-4 rounded shadow hover:scale-105',
          props.theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
        )}
        onClick={props.onClick}>
        {slots.default ? slots.default() : 'toggleTheme'}
      </button>
    );
  },
});
