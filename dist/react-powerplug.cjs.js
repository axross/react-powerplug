'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var _objectSpread = _interopDefault(
  require('@babel/runtime/helpers/builtin/objectSpread')
)
var _inheritsLoose = _interopDefault(
  require('@babel/runtime/helpers/builtin/inheritsLoose')
)
var _assertThisInitialized = _interopDefault(
  require('@babel/runtime/helpers/builtin/assertThisInitialized')
)
var _defineProperty = _interopDefault(
  require('@babel/runtime/helpers/builtin/defineProperty')
)
var React = require('react')
var _objectWithoutProperties = _interopDefault(
  require('@babel/runtime/helpers/builtin/objectWithoutProperties')
)

/* eslint-disable no-console */
var warn = function warn(condition, message, trace) {
  if (trace === void 0) {
    trace = true
  }

  if (condition) {
    console.warn('[react-powerplug]: ' + message)
    console.trace && trace && console.trace('Trace')
  }
}

var isFn = function isFn(prop) {
  return typeof prop === 'function'
}
/**
 * renderProps
 * is a render/children props interop.
 * will pick up the prop that was used,
 * or children if both are used
 */

var renderProps = function renderProps(_ref) {
  var children = _ref.children,
    render = _ref.render

  if (process.env.NODE_ENV !== 'production') {
    warn(
      isFn(children) && isFn(render),
      'You are using the children and render props together.\n' +
        'This is impossible, therefore, only the children will be used.'
    )
  }

  var fn = isFn(children) ? children : render

  for (
    var _len = arguments.length,
      props = new Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    props[_key - 1] = arguments[_key]
  }

  return fn ? fn.apply(void 0, props) : null
}

var noop = function noop() {}

var State =
  /*#__PURE__*/
  (function(_Component) {
    _inheritsLoose(State, _Component)

    function State() {
      var _temp, _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      return (
        ((_temp = _this =
          _Component.call.apply(_Component, [this].concat(args)) || this),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          'state',
          _objectSpread({}, _this.props.initial)
        ),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          '_setState',
          function(updater, cb) {
            if (cb === void 0) {
              cb = noop
            }

            _this.setState(updater, function() {
              _this.props.onChange(_this.state)

              cb()
            })
          }
        ),
        _temp) || _assertThisInitialized(_this)
      )
    }

    var _proto = State.prototype

    _proto.render = function render() {
      return renderProps(this.props, {
        state: this.state,
        setState: this._setState,
      })
    }

    return State
  })(React.Component)

_defineProperty(State, 'defaultProps', {
  initial: {},
  onChange: noop,
})

var Active = function Active(_ref) {
  var onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['onChange'])

  return React.createElement(
    State,
    {
      initial: {
        isActive: false,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        isActive: state.isActive,
        bind: {
          onMouseDown: function onMouseDown() {
            return setState({
              isActive: true,
            })
          },
          onMouseUp: function onMouseUp() {
            return setState({
              isActive: false,
            })
          },
        },
      })
    }
  )
}

var isElement = function isElement(element) {
  return typeof element.type === 'function'
}

var compose = function compose() {
  for (
    var _len = arguments.length, elements = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    elements[_key] = arguments[_key]
  }

  return function(composedProps) {
    // Stack children arguments recursively and pass
    // it down until the last component that render children
    // with these stacked arguments
    function stackProps(i, elements, propsList) {
      if (propsList === void 0) {
        propsList = []
      }

      var element = elements[i]
      var isTheLast = i === 0 // Check if is latest component.
      // If is latest then render children,
      // Otherwise continue stacking arguments

      var renderFn = function renderFn(props) {
        return isTheLast
          ? renderProps.apply(
              void 0,
              [composedProps].concat(propsList.concat(props))
            )
          : stackProps(i - 1, elements, propsList.concat(props))
      } // Clone a element if it's passed created as <Element initial={} />
      // Or create it if passed as just Element

      var elementFn = isElement(element)
        ? React.cloneElement
        : React.createElement
      return elementFn(element, {}, renderFn)
    }

    return stackProps(elements.length - 1, elements.reverse())
  }
}

var Compose = function Compose(_ref) {
  var components = _ref.components,
    props = _objectWithoutProperties(_ref, ['components'])

  return compose.apply(void 0, components)(props)
}

var set = function set(updater, arg) {
  return typeof updater === 'function' ? updater(arg) : updater
}

var add = function add(value) {
  return function(state) {
    return {
      count: state.count + value,
    }
  }
}

var Counter = function Counter(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? 0 : _ref$initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: {
        count: initial,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        count: state.count,
        inc: function inc() {
          return setState(add(1))
        },
        dec: function dec() {
          return setState(add(-1))
        },
        incBy: function incBy(value) {
          return setState(add(value))
        },
        decBy: function decBy(value) {
          return setState(add(-value))
        },
        set: function set$$1(value) {
          return setState(function(s) {
            return {
              on: set(value, s.on),
            }
          })
        },
      })
    }
  )
}

var Focus = function Focus(_ref) {
  var onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['onChange'])

  return React.createElement(
    State,
    {
      initial: {
        isFocused: false,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        isFocused: state.isFocused,
        bind: {
          onFocus: function onFocus() {
            return setState({
              isFocused: true,
            })
          },
          onBlur: function onBlur() {
            return setState({
              isFocused: false,
            })
          },
        },
      })
    }
  )
}

var FocusManager = function FocusManager(_ref) {
  var _onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['onChange'])

  return React.createElement(
    State,
    {
      initial: {
        isFocused: false,
        timeoutId: null,
      },
      onChange: function onChange(_ref2) {
        var isFocused = _ref2.isFocused
        return (
          _onChange &&
          _onChange({
            isFocused: isFocused,
          })
        )
      },
    },
    function(_ref3) {
      var state = _ref3.state,
        setState = _ref3.setState
      return renderProps(props, {
        isFocused: state.isFocused,
        blur: function blur() {
          setState({
            isFocused: false,
          })
        },
        bind: {
          tabIndex: -1,
          onBlur: function onBlur() {
            // the timeoutId is saved in state to not cleanup in a rerender
            setState({
              timeoutId: setTimeout(function() {
                setState({
                  isFocused: false,
                })
              }),
            })
          },
          onFocus: function onFocus() {
            clearTimeout(state.timeoutId)
            setState({
              isFocused: true,
            })
          },
        },
      })
    }
  )
}

var Form = function Form(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? {} : _ref$initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: _objectSpread({}, initial),
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        values: _objectSpread({}, state),
        input: function input(id) {
          var value = state[id] || ''

          var setValue = function setValue(value) {
            var _setState

            return setState(
              ((_setState = {}), (_setState[id] = value), _setState)
            )
          }

          return {
            bind: {
              onChange: function onChange(event) {
                return setValue(event.target.value)
              },
              value: value,
            },
            set: function set$$1(value) {
              return setState(function(s) {
                var _ref3

                return (_ref3 = {}), (_ref3[id] = set(value, s.value)), _ref3
              })
            },
            value: value,
          }
        },
      })
    }
  )
}

var Hover = function Hover(_ref) {
  var onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['onChange'])

  return React.createElement(
    State,
    {
      initial: {
        isHovered: false,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        isHovered: state.isHovered,
        bind: {
          onMouseEnter: function onMouseEnter() {
            return setState({
              isHovered: true,
            })
          },
          onMouseLeave: function onMouseLeave() {
            return setState({
              isHovered: false,
            })
          },
        },
      })
    }
  )
}

var Input = function Input(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? '' : _ref$initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: {
        value: initial,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        bind: {
          onChange: function onChange(event) {
            return setState({
              value: event.target.value,
            })
          },
          value: state.value,
        },
        set: function set$$1(value) {
          return setState(function(s) {
            return {
              value: set(value, s.value),
            }
          })
        },
        value: state.value,
      })
    }
  )
}

var Interval =
  /*#__PURE__*/
  (function(_Component) {
    _inheritsLoose(Interval, _Component)

    function Interval() {
      var _temp, _this

      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      return (
        ((_temp = _this =
          _Component.call.apply(_Component, [this].concat(args)) || this),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          'state',
          {
            times: 0,
          }
        ),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          'intervalId',
          undefined
        ),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          '_clearIntervalIfNecessary',
          function() {
            if (_this.intervalId) {
              _this.intervalId = clearInterval(_this.intervalId)
            }
          }
        ),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          '_setIntervalIfNecessary',
          function(delay) {
            if (Number.isFinite(delay)) {
              _this.intervalId = setInterval(function() {
                return _this.setState(function(s) {
                  return {
                    times: s.times + 1,
                  }
                })
              }, delay)
            }
          }
        ),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          'stop',
          function() {
            _this._clearIntervalIfNecessary()
          }
        ),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          'start',
          function(delay) {
            var _delay =
              typeof delay === 'number'
                ? delay
                : _this.props.delay != null
                  ? _this.props.delay
                  : 1000

            _this._setIntervalIfNecessary(_delay)
          }
        ),
        _defineProperty(
          _assertThisInitialized(_assertThisInitialized(_this)),
          'toggle',
          function() {
            _this.intervalId ? _this.stop() : _this.start()
          }
        ),
        _temp) || _assertThisInitialized(_this)
      )
    }

    var _proto = Interval.prototype

    _proto.componentDidMount = function componentDidMount() {
      this.start()
    }

    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      if (prevProps.delay !== this.props.delay) {
        this.stop()
        this.start()
      }
    }

    _proto.componentWillUnmount = function componentWillUnmount() {
      this.stop()
    }

    _proto.render = function render() {
      return renderProps(this.props, {
        start: this.start,
        stop: this.stop,
        toggle: this.toggle,
      })
    }

    return Interval
  })(React.Component)

var complement = function complement(fn) {
  return function() {
    return !fn.apply(void 0, arguments)
  }
}

var List = function List(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? [] : _ref$initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: {
        list: initial,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        list: state.list,
        first: function first() {
          return state.list[0]
        },
        last: function last() {
          return state.list[Math.max(0, state.list.length - 1)]
        },
        set: function set$$1(list) {
          return setState(function(s) {
            return {
              list: set(list, s.list),
            }
          })
        },
        push: function push() {
          for (
            var _len = arguments.length, values = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            values[_key] = arguments[_key]
          }

          return setState(function(s) {
            return {
              list: s.list.concat(values),
            }
          })
        },
        pull: function pull(predicate) {
          return setState(function(s) {
            return {
              list: s.list.filter(complement(predicate)),
            }
          })
        },
        sort: function sort(compareFn) {
          return setState(function(s) {
            return {
              list: s.list.concat().sort(compareFn),
            }
          })
        },
      })
    }
  )
}

var Map = function Map(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? {} : _ref$initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: _objectSpread({}, initial),
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        values: state,
        set: function set(key, value) {
          var _setState

          return setState(
            ((_setState = {}), (_setState[key] = value), _setState)
          )
        },
        over: function over(key, fn) {
          return setState(function(s) {
            var _ref3

            return (_ref3 = {}), (_ref3[key] = fn(s[key])), _ref3
          })
        },
        get: function get(key) {
          return state[key]
        },
      })
    }
  )
}

var unique = function unique(arr) {
  return arr.filter(function(d, i) {
    return arr.indexOf(d) === i
  })
}

var hasItem = function hasItem(arr, item) {
  return arr.indexOf(item) !== -1
}

var removeItem = function removeItem(arr, item) {
  return hasItem(arr, item)
    ? arr.filter(function(d) {
        return d !== item
      })
    : arr
}

var addUnique = function addUnique(arr, item) {
  return hasItem(arr, item) ? arr : arr.concat([item])
}

var Set = function Set(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? [] : _ref$initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: {
        values: unique(initial),
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        values: state.values,
        add: function add(key) {
          return setState({
            values: addUnique(state.values, key),
          })
        },
        clear: function clear() {
          return setState({
            values: [],
          })
        },
        remove: function remove(key) {
          return setState({
            values: removeItem(state.values, key),
          })
        },
        has: function has(key) {
          return hasItem(state.values, key)
        },
      })
    }
  )
}

var Toggle = function Toggle(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? false : _ref$initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: {
        on: initial,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        on: state.on,
        toggle: function toggle() {
          return setState(function(s) {
            return {
              on: !s.on,
            }
          })
        },
        set: function set$$1(value) {
          return setState(function(s) {
            return {
              on: set(value, s.on),
            }
          })
        },
      })
    }
  )
}

var Touch = function Touch(_ref) {
  var onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['onChange'])

  return React.createElement(
    State,
    {
      initial: {
        isTouched: false,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        isTouched: state.isTouched,
        bind: {
          onTouchStart: function onTouchStart() {
            return setState({
              isTouched: true,
            })
          },
          onTouchEnd: function onTouchEnd() {
            return setState({
              isTouched: false,
            })
          },
        },
      })
    }
  )
}

var Value = function Value(_ref) {
  var initial = _ref.initial,
    onChange = _ref.onChange,
    props = _objectWithoutProperties(_ref, ['initial', 'onChange'])

  return React.createElement(
    State,
    {
      initial: {
        value: initial,
      },
      onChange: onChange,
    },
    function(_ref2) {
      var state = _ref2.state,
        setState = _ref2.setState
      return renderProps(props, {
        value: state.value,
        set: function set$$1(value) {
          return setState(function(s) {
            return {
              value: set(value, s.value),
            }
          })
        },
      })
    }
  )
}

var composeEvents = function composeEvents() {
  for (
    var _len = arguments.length, objEvents = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    objEvents[_key] = arguments[_key]
  }

  return objEvents.reverse().reduce(function(allEvents, events) {
    var append = {}

    var _loop = function _loop(key) {
      append[key] = allEvents[key] // Already have this event: let's merge
        ? function() {
            events[key].apply(events, arguments)
            allEvents[key].apply(allEvents, arguments)
          } // Don't have this event yet: just assign the event
        : events[key]
    }

    for (var key in events) {
      _loop(key)
    }

    return _objectSpread({}, allEvents, append)
  })
}

exports.Active = Active
exports.Compose = Compose
exports.Counter = Counter
exports.Focus = Focus
exports.FocusManager = FocusManager
exports.Form = Form
exports.Hover = Hover
exports.Input = Input
exports.Interval = Interval
exports.List = List
exports.Map = Map
exports.Set = Set
exports.State = State
exports.Toggle = Toggle
exports.Touch = Touch
exports.Value = Value
exports.compose = compose
exports.composeEvents = composeEvents
exports.renderProps = renderProps
