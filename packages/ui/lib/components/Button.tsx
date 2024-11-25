import { defineComponent, h, type PropType } from 'vue';
import { cn } from '../utils';

type ButtonProps = {
  theme?: 'light' | 'dark';
  className?: string;
  children: any;
};

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
    children: {
      type: [String, Object, Array] as PropType<any>, // React children type
      default: () => [],
    },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: undefined,
    },
  },
  setup(props: ButtonProps, { attrs }) {
    return () => (
      <button
        class={cn(
          props.className,
          'py-1 px-4 rounded shadow hover:scale-105',
          props.theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
        )}
        {...attrs} // to pass down other attributes (like event handlers)
      >
        {props.children}
      </button>
    );
  },
});
