import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
    return (
    <motion.div
        ref={ref}
        data-index={index}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.2, delay }}
        style={{ marginBottom: '1rem', cursor: 'pointer' }}
    >
    {children}
    </motion.div>
);
};

const AnimatedList = ({
    items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
    'Item 13',
    'Item 14',
    'Item 15'
    ],
    onItemSelect,
    showGradients = true,
    enableArrowNavigation = true,
    className = '',
    itemClassName = '',
    displayScrollbar = true,
    initialSelectedIndex = -1
}) => {
    const listRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
    const [keyboardNav, setKeyboardNav] = useState(false);
    const [topGradientOpacity, setTopGradientOpacity] = useState(0);
    const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

    const handleScroll = e => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        setTopGradientOpacity(Math.min(scrollTop / 50, 1));
        const bottomDistance = scrollHeight - (scrollTop + clientHeight);
        setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
    };

    useEffect(() => {
        if (!enableArrowNavigation) return;
        const handleKeyDown = e => {
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            setKeyboardNav(true);
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            if (selectedIndex >= 0 && selectedIndex < items.length) {
            e.preventDefault();
            if (onItemSelect) {
                onItemSelect(items[selectedIndex], selectedIndex);
            }
            }
        }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

    useEffect(() => {
        if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
        const container = listRef.current;
        const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
        if (selectedItem) {
        const extraMargin = 50;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;
        if (itemTop < containerScrollTop + extraMargin) {
            container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
        } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
            container.scrollTo({
            top: itemBottom - containerHeight + extraMargin,
            behavior: 'smooth'
            });
        }
        }
        setKeyboardNav(false);
    }, [selectedIndex, keyboardNav]);

    return (
        <div className={`scroll-list-container ${className}`}>
        <div ref={listRef} className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''}`} onScroll={handleScroll}>
            {items.map((item, index) => (
            <AnimatedItem
                key={index}
                delay={0.1}
                index={index}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                setSelectedIndex(index);
                if (onItemSelect) {
                    onItemSelect(item, index);
                }
                }}
            >
                <div className={`item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`}>
                <div className='crcard'>
                    <div className="icon">
                    <ion-icon name="albums-outline"></ion-icon>
                </div>
                <div className='info'>
                    <p className="item-text title">Class Room: {item.name}</p>
                    <p className="item-text">Description:{item.description}</p>
                </div>
                </div>
                    <button aria-label="Delete item" class="delete-button">
                    <svg
                        class="trash-svg"
                        viewBox="0 -10 64 74"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="trash-can">
                        <rect
                            x="16"
                            y="24"
                            width="32"
                            height="30"
                            rx="3"
                            ry="3"
                            fill="#e74c3c"
                        ></rect>

                        <g transform-origin="12 18" id="lid-group">
                            <rect
                            x="12"
                            y="12"
                            width="40"
                            height="6"
                            rx="2"
                            ry="2"
                            fill="#c0392b"
                            ></rect>
                            <rect
                            x="26"
                            y="8"
                            width="12"
                            height="4"
                            rx="2"
                            ry="2"
                            fill="#c0392b"
                            ></rect>
                        </g>
                        </g>
                    </svg>
                    </button>

                </div>
            </AnimatedItem>
            ))}
        </div>
        {showGradients && (
            <>
            <div className="top-gradient" style={{ opacity: topGradientOpacity }}></div>
            <div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }}></div>
            </>
        )}
        </div>
    );
};

export default AnimatedList;
