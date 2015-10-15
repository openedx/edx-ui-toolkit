<a href="<%- main.url %>" class="user-title">
    <span class="sr"><%- main.screenreader_label %> </span><%- main.text %>
</a>
<button type="button" class="button button-more has-dropdown js-dropdown-button" aria-haspopup="true" aria-expanded="false" aria-controls="edx-user-menu">
    <span class="sr"><%- button_label %></span>
</button>
<ul class="dropdown-menu is-hidden" id="edx-user-menu" tabindex="-1">
    <% _.each(items, function(item, index) { %>
        <li class="dropdown-item<% if (items.length - 1 === index) { %> last<% } %>">
            <a href="<%- item.url %>" class="action<% if (items.length-1 === index) { %> last<% } %>"><%- item.text %></a>
        </li>
    <% }); %>
</ul>
