(function (React, designSystem) {
    'use strict';

    function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

    var React__default = /*#__PURE__*/_interopDefault(React);

    const PriorityBadge = props => {
      const {
        record,
        property
      } = props;
      const value = record.params[property.name];
      if (!value) {
        return null;
      }
      let variant = 'default';
      switch (value) {
        case 'HIGH':
          variant = 'danger'; // Red
          break;
        case 'MEDIUM':
          variant = 'warning'; // Orange/Yellow
          break;
        case 'COURTESY':
        case 'MESSAGE':
          variant = 'info'; // Blue/Info
          break;
        default:
          variant = 'light';
      }
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Badge, {
        variant: variant
      }, value));
    };

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.PriorityBadge = PriorityBadge;

})(React, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Qcmlvcml0eUJhZGdlLmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IHsgQmFkZ2UsIEJveCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nXHJcblxyXG5jb25zdCBQcmlvcml0eUJhZGdlID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7IHJlY29yZCwgcHJvcGVydHkgfSA9IHByb3BzXHJcbiAgICBjb25zdCB2YWx1ZSA9IHJlY29yZC5wYXJhbXNbcHJvcGVydHkubmFtZV1cclxuXHJcbiAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdmFyaWFudCA9ICdkZWZhdWx0J1xyXG4gICAgc3dpdGNoICh2YWx1ZSkge1xyXG4gICAgICAgIGNhc2UgJ0hJR0gnOlxyXG4gICAgICAgICAgICB2YXJpYW50ID0gJ2RhbmdlcicgLy8gUmVkXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAnTUVESVVNJzpcclxuICAgICAgICAgICAgdmFyaWFudCA9ICd3YXJuaW5nJyAvLyBPcmFuZ2UvWWVsbG93XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAnQ09VUlRFU1knOlxyXG4gICAgICAgIGNhc2UgJ01FU1NBR0UnOlxyXG4gICAgICAgICAgICB2YXJpYW50ID0gJ2luZm8nIC8vIEJsdWUvSW5mb1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHZhcmlhbnQgPSAnbGlnaHQnXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICA8QmFkZ2UgdmFyaWFudD17dmFyaWFudH0+e3ZhbHVlfTwvQmFkZ2U+XHJcbiAgICAgICAgPC9Cb3g+XHJcbiAgICApXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByaW9yaXR5QmFkZ2VcclxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgUHJpb3JpdHlCYWRnZSBmcm9tICcuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9Qcmlvcml0eUJhZGdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcmlvcml0eUJhZGdlID0gUHJpb3JpdHlCYWRnZSJdLCJuYW1lcyI6WyJQcmlvcml0eUJhZGdlIiwicHJvcHMiLCJyZWNvcmQiLCJwcm9wZXJ0eSIsInZhbHVlIiwicGFyYW1zIiwibmFtZSIsInZhcmlhbnQiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJCb3giLCJCYWRnZSIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUdBLE1BQU1BLGFBQWEsR0FBSUMsS0FBSyxJQUFLO01BQzdCLE1BQU07UUFBRUMsTUFBTTtJQUFFQyxJQUFBQTtJQUFTLEdBQUMsR0FBR0YsS0FBSztNQUNsQyxNQUFNRyxLQUFLLEdBQUdGLE1BQU0sQ0FBQ0csTUFBTSxDQUFDRixRQUFRLENBQUNHLElBQUksQ0FBQztNQUUxQyxJQUFJLENBQUNGLEtBQUssRUFBRTtJQUNSLElBQUEsT0FBTyxJQUFJO0lBQ2YsRUFBQTtNQUVBLElBQUlHLE9BQU8sR0FBRyxTQUFTO0lBQ3ZCLEVBQUEsUUFBUUgsS0FBSztJQUNULElBQUEsS0FBSyxNQUFNO1VBQ1BHLE9BQU8sR0FBRyxRQUFRLENBQUE7SUFDbEIsTUFBQTtJQUNKLElBQUEsS0FBSyxRQUFRO1VBQ1RBLE9BQU8sR0FBRyxTQUFTLENBQUE7SUFDbkIsTUFBQTtJQUNKLElBQUEsS0FBSyxVQUFVO0lBQ2YsSUFBQSxLQUFLLFNBQVM7VUFDVkEsT0FBTyxHQUFHLE1BQU0sQ0FBQTtJQUNoQixNQUFBO0lBQ0osSUFBQTtJQUNJQSxNQUFBQSxPQUFPLEdBQUcsT0FBTztJQUN6QjtNQUVBLG9CQUNJQyxzQkFBQSxDQUFBQyxhQUFBLENBQUNDLGdCQUFHLHFCQUNBRixzQkFBQSxDQUFBQyxhQUFBLENBQUNFLGtCQUFLLEVBQUE7SUFBQ0osSUFBQUEsT0FBTyxFQUFFQTtPQUFRLEVBQUVILEtBQWEsQ0FDdEMsQ0FBQztJQUVkLENBQUM7O0lDaENEUSxPQUFPLENBQUNDLGNBQWMsR0FBRyxFQUFFO0lBRTNCRCxPQUFPLENBQUNDLGNBQWMsQ0FBQ2IsYUFBYSxHQUFHQSxhQUFhOzs7Ozs7In0=
