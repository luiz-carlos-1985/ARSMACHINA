# Send Button Icon Update - TODO List

## Plan: Replace gradient/solid background with background image for send icon

### Tasks to Complete:
- [x] Remove solid background color from `.send-btn`
- [x] Remove gradient backgrounds from hover state
- [x] Remove gradient backgrounds from disabled state  
- [x] Configure background-image property for custom icon
- [x] Remove border styling (not needed with image background)
- [x] Update hover effects to work with image background
- [x] Update disabled state with grayscale filter
- [x] Preserve existing animations and transitions

### Files to Edit:
- [x] `src/app/chatbot/chatbot.component.css` - Update .send-btn styles

### Status: 
- [x] Plan created and approved
- [x] Implementation completed successfully

### Final Changes Made:
- **Background**: Changed to `url('/assets/ars-machina-logo.svg') center/contain no-repeat`
- **Border**: Removed border (set to `none`)
- **Color**: Set to `transparent` since image will be visible
- **Hover State**: Uses `filter: brightness(1.1)` to brighten image on hover
- **Active State**: Uses `filter: brightness(0.9)` to darken image when clicked
- **Disabled State**: Uses `filter: grayscale(100%)` and reduced opacity
- **Shadows**: Updated to neutral colors to work with any image
- **Animations**: Preserved all existing transitions and pulse animation

### Instructions for Use:
✅ **COMPLETED**: The button now uses the existing Ars Machina logo as the background image.
Current path: `'/assets/ars-machina-logo.svg'`

To use a different send icon:
1. Add your send icon image to the `src/assets/` folder
2. Replace `'/assets/ars-machina-logo.svg'` with your image path
3. Examples: `'/assets/send-icon.png'` or `'/assets/send-button.svg'`

### Build Status:
✅ **RESOLVED**: Fixed the asset path resolution by using absolute path `/assets/ars-machina-logo.svg`
