# Project Dev Notes & Learnings

Just dropping some notes here to remember how this whole timetable generator app came together. It ended up being a really solid build with some pretty clever workarounds that I definitely want to remember for future projects.

## The Stack (Packages)
- **Vite + React**: Standard blazing-fast setup.
- **Tailwind CSS (v4)**: Handled all the styling. Kept things moving fast.
- **lucide-react**: Used this for all the UI icons (burger menu, user profile, download buttons, etc.). Clean and consistent.
- **react-markdown** + **remark-gfm**: Used this to render the AI's markdown responses into the chat UI.
- **rehype-raw**: This was actually a lifesaver. The standard markdown table syntax doesn't support complex things like `colspan` or `rowspan`. Because the Indonesian university RPS layout required those complex merged cells in the header, I had to force the AI to generate raw HTML for the table header. `rehype-raw` allowed React Markdown to parse and render that raw HTML perfectly alongside the standard markdown tables.

## Cool Techniques & Hacks Used

### 1. The "Magic" Light Mode CSS Trick
The entire app was originally styled explicitly with hardcoded dark hex colors (like `bg-[#2a3950]`). When the requirement came in to add a Light Mode, rewriting every single Tailwind class across the whole app would have been a nightmare. 

Instead, I used this trick in `index.css`:
```css
html:not(.dark) {
  filter: invert(1) hue-rotate(180deg);
}
```
This mathematically inverted all the dark colors into light colors, but the `hue-rotate(180deg)` meant that the signature pink/red accent colors (`#f34868`) stayed perfectly intact! I just had to add a few manual CSS overrides targeting specific hex codes (forcing them to black so they'd invert to pure white) to make the background look crisp instead of a weird inverted grey-blue. It saved hours of refactoring.

### 2. Client-Side DOCX Export
Exporting complex HTML tables to Word usually requires a backend library. To keep this entirely frontend, I wrote a script that grabs the `innerHTML` of the rendered markdown component, wraps it in Microsoft Office-specific XML/HTML metadata (`xmlns:o='urn:schemas-microsoft-com:office:office'`), and creates a downloadable Blob object (`application/msword`). It captures the exact CSS styling and layout flawlessly without touching a server.

### 3. DeepSeek SSE Streaming
Instead of using standard REST calls where the user has to wait 10+ seconds for the AI to generate the massive timetable, I tapped into DeepSeek's Server-Sent Events (SSE). By passing `stream: true` in the fetch payload, I used the browser's `TextDecoder` and `response.body.getReader()` to intercept the raw byte chunks in real-time. Parsing the `data: ` chunks and iteratively updating the React state gave it that buttery smooth, ChatGPT-style typing effect.

### 4. Robust Mobile Viewport Handling
Added `viewport-fit=cover` and `maximum-scale=1.0, user-scalable=no` to the meta tags. It's a small detail, but it stops iOS devices from annoyingly auto-zooming the entire screen when the user taps into the chat input area. Also heavily dialed back the desktop paddings (`p-6` to `p-2`) and added `overflow-x-auto` to the massive timetable grids so mobile users wouldn't get completely broken layouts.

Overall, everything clicked together really well. The architecture is solid, the UX is snappy, and the code is pretty lean all things considered.
