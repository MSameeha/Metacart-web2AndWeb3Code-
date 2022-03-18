import PropTypes from 'prop-types';

export default function Image({ src, caption, width, height }) {
  return <img src={src} alt={caption} width={width} height={height} />;
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
