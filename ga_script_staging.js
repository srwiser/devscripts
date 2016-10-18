var socket = io.connect('https://tracking.iref.com',{
    'reconnectionAttempts': 1,
});
socket.on('connect_error',function(err){
    console.log(err);
    socket = io.connect('https://tracking.iref.com:8000',{
        'reconnection': false,
        'force new connection': true
    });
});
function sendEvent(category, action, label) {
    var data = {
        "event_category": category,
        "event_action": action,
        "event_label": label
    };
    socket.emit('iref_event',data);
}
var click_category_list = ['div[category=click_project_button]','input[category=click_signup_username]','input[category=click_signup_email]',
                           'input[category=click_signup_password]','input[category=signup_on_signup_page]','a[category=login_on_signup_page]',
                           'a[category=click_singlelogin_select]','input[category=click_singlelogin_save]','a[category=click_singlelogin_close]',
                           'a[category=click_newdiscussion]','a[category=click_joindiscussion]','a[category=click_subscribe]','a[category=attachment]','img[category=attachment]'];

var impression_category_list = ['div[category=impressions_project_button]','div[category=view_singlelogin_popup]', 'div[category=fr_impression_forced_signup]'];

// Code by Google

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-16130228-1', 'auto');
  ga('send', 'pageview');

// Code by google ends
ga(function(tracker) {
  window.client_id = tracker.get('clientId');
});

function source() {
    // checking for mobile or web
    if (navigator.userAgent.toLowerCase().indexOf('mobile') != -1){
        return 'mobile';
    } else if (navigator.userAgent.toLowerCase().indexOf('tablet') != -1){
        return 'mobile';
    } else {
        return 'web';
    }
}

function pushGAEvent(category, action, label){
    label['source'] = source();
    if(category || action) {
        sendEvent(category,action,label);
        ga('send', 'event', category, action, JSON.stringify(label));
    }
}

function sendPageURLEvent(){

    var pageInfo = pageType();

    var now = new Date().getTime();
    var label = {
        'skin': 'new',
        'uid': window.client_id,
        'session_id': window.analytics_session,
        'user_id': window.analytics_userid,
        'timestamp': now,
        'url_source': pageInfo.pathName,
        'source': source(),
    };

    pushGAEvent('page_url',pageInfo.pageType, label)
}

if (click_category_list.length > 0){
    $(click_category_list.join()).bind('click', function(event) { //

            pageInfo = pageType();     
            category = $(this).attr('category');
            action = $(this).attr('action');
            
            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            var analytics_data = $(this).attr('analytics_data');
            try {
                analytics_data = JSON.parse(analytics_data);
            } catch(e) {}
            label['analytics_data'] = analytics_data;
            // for categories click_singlelogin_select and click_singlelogin_save
            if (category==='click_singlelogin_select' || category === 'click_singlelogin_save') {
                label['selected_option'] = $('#recommend_or_selected').attr('value');
            }
            pushGAEvent(category, action, label);
    });
}

function push_impressions(){
    var pageInfo = pageType();

    var now = new Date().getTime();
    var label = {
        'skin': 'new',
        'uid': window.client_id,
        'session_id': window.analytics_session,
        'user_id': window.analytics_userid,
        'timestamp': now,
        'url_source': pageInfo.pathName,
    };

    for (var i = 0; i < impression_category_list.length; i++) {
        var element = $(impression_category_list[i]);
        var category = element.attr('category');
        var action = element.attr('action');
        var analytics_data = element.attr('analytics_data');
        try {
            analytics_data = JSON.parse(analytics_data);
        } catch(e) {}
        label['analytics_data'] = analytics_data;       
        pushGAEvent(category, action, label);
    };
}

document.addEventListener('click',function (event) {
    var category = '';
    var action = '';
    var comment = '';
    var ex = '';
    var tagName = event.target.tagName;
    var now;
    var pageInfo = '';
    var select_option = '';
    
    if(tagName == 'IMG' && event.target.getAttribute('src')){
        if(event.target.getAttribute('src').indexOf('report_violation.png') != -1){
            pageInfo = pageType();
            category = 'post_options';
            action = 'report_violation_button';

            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'post_id': event.target.parentNode.getAttribute('href').split('=')[1]
            };

            pushGAEvent(category, action, label);

        } else if(event.target.getAttribute('src').indexOf('report_thread.png') != -1){
            pageInfo = pageType();
            category = 'post_options';
            action = 'report_thread_title_button';

            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'post_id': event.target.parentNode.getAttribute('href').split('=')[1]
            };

            pushGAEvent(category, action, label);
            
        } else if(event.target.getAttribute('src').indexOf('multiquote_off.png') != -1){
            pageInfo = pageType();
            category = 'post_options';
            action = 'multi_quote_button';

            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'post_id': event.target.getAttribute('id').split('_')[1],
                'clicked_on': 'on'
            };

            pushGAEvent(category, action, label);
            
        } else if(event.target.getAttribute('src').indexOf('multiquote_on.png') != -1){
            pageInfo = pageType();
            category = 'post_options';
            action = 'multi_quote_button';

            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'post_id': event.target.getAttribute('id').split('_')[1],
                'clicked_on': 'off'
            };

            pushGAEvent(category, action, label);
            
        } else if(event.target.getAttribute('src').indexOf('logo-revamped.png') != -1){
            pageInfo = pageType();
            category = pageInfo.pageType;
            action = 'logo_click';
            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id':window.analytics_userid,
                'timestamp':now,
                'url_source':pageInfo.pathName,
                'position':'header'
            };

            pushGAEvent(category, action, label);       
        } else if(event.target.getAttribute('src').indexOf('iref_footer_logo.png') != -1){
            pageInfo = pageType();
            category = pageInfo.pageType;
            action = 'logo_click';
            
            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id':window.analytics_userid,
                'timestamp':now,
                'url_source':pageInfo.pathName,
                'position':'footer'
            };
        
            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.parentNode.getAttribute('class') == 'footer_top_right'){
            pageInfo = pageType();
            if(event.target.getAttribute('alt') == 'IREF Facebook'){
                category = 'fb_page';
            } else if(event.target.getAttribute('alt') == 'IREF Google+'){
                category = 'google_page';
            } else if(event.target.getAttribute('alt') == 'IREF Twitter'){
                category = 'twitter_page';
            }  else {
                category = 'new_share_page';
            }

            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.parentNode.getAttribute('class') == 'iref_app_block'){
            pageInfo = pageType();
            category = 'breadcrumb_clicks';
            if(event.target.getAttribute('src').indexOf('android') != -1){
                category = 'android_app_download';
            } else if(event.target.getAttribute('src').indexOf('i_store_app_icon') != -1){
                category = 'ios_app_download';
            }  else {
                category = 'empty_app_page';
            }

            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        }
    } else if(tagName == 'A'){        
        if(event.target.getAttribute('class') == 'thrdFavIcon'){
            pageInfo = pageType();
            category = 'thread_favorites';
            action = 'favorites';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('class') == 'thrdSubIcon'){
            pageInfo = pageType();
            category = (pageInfo.pathName.indexOf('/t-') != -1 ? 'thread_subscribe':'forum_subscribe');
            action = category;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'session_id': window.analytics_session,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label); 
        } else if(event.target.getAttribute('id') == 'idLostPasswordLink'){
            pageInfo = pageType();
            category = 'forgot_password';
            action = 'click';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'session_id': window.analytics_session,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label); 
        }  else if(event.target.getAttribute('href')!=null && event.target.getAttribute('href').indexOf('terms_and_conditions') != -1){            
            pageInfo = pageType();
            category = pageInfo.pageType;
            action = 'terms_and_conditions';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        }else if(event.target.getAttribute('href')!=null && event.target.getAttribute('href').indexOf('builder_guidelines') != -1){
            pageInfo = pageType();
            category = pageInfo.pageType;
            action = 'builder_guidelines';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        }else if(event.target.getAttribute('href')!=null && event.target.getAttribute('href').indexOf('builder') != -1){
            pageInfo = pageType();
            category = pageInfo.pageType;
            action = 'builder_signup';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        }else if(event.target.getAttribute('href')!=null && event.target.getAttribute('href').indexOf('newthread.php') != -1){
            pageInfo = pageType();
            category = 'new_thread';
            action = (event.target.parentNode.parentNode.getAttribute('valign') == 'bottom' ? 'top_button':'bottom_button');
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('href')!=null && event.target.getAttribute('href').indexOf('newreply') != -1 && event.target.getAttribute('class') == 'btn-md'){
            pageInfo = pageType();
            category = 'reply_to_post';
            action = (event.target.parentNode.parentNode.getAttribute('valign') == 'bottom' ? 'top_reply_button':'bottom_reply_button');
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.parentNode.getAttribute('class') == 'navt' ||
                event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('class') == 'navt' ||
                event.target.parentNode.parentNode.parentNode.getAttribute('class') == 'cty_block_one'){

            pageInfo = pageType();
            category = 'city_selection_bar_header';
            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.innerHTML == 'Revert to old theme'){
            pageInfo = pageType();
            category = 'theme_switch';
            action = 'revert_to_old_theme';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('class') == 'headernav signup'){
            pageInfo = pageType();
            category = 'sign_up_button';
            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        }else if(event.target.getAttribute('class') == 'headernav b_menu__dropdownbutton login'){
            pageInfo = pageType();
            category = 'login_button';
            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('class') == 'alt2'){
            pageInfo = pageType();
            category = 'forum_listing_homepage';
            action = 'last_post';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.getAttribute('class') == 'searchLinks' && event.target.parentNode.parentNode.getAttribute('id') == 'navbar_search_header_menu'){
            pageInfo = pageType();
            category = 'search_dropdown';
            action = event.target.innerHTML.replace(/\s+/g, '_').toLowerCase();
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.parentNode.getAttribute('id') == 'a2apage_dropdown'){
            pageInfo = pageType();
            category = 'thread_share';
            var temp_class = event.target.getAttribute('href')
            if(temp_class.indexOf('facebook') != -1){
                action = 'facebook_button';
            } else if(temp_class.indexOf('google_plus') != -1){
                action = 'google_button';
            } else if(temp_class.indexOf('twitter') != -1){
                action = 'twitter_button';
            } else {
                action = 'other_buttons';
            }

            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.parentNode.parentNode.parentNode.getAttribute('id') == 'collapseobj_similarthreads'){
            pageInfo = pageType();
            category = 'related_threads';
            action = 'related_thread_url';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.getAttribute('id') == 'tag_list_cell'){
            pageInfo = pageType();
            category = 'tag_cloud';
            action = 'tag_url';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'tag_value': event.target.innerHTML,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.innerHTML == 'Add Post To Favorites'){
            pageInfo = pageType();
            category = 'post_options';
            action = 'add_post_to_fav';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('class') == 'vbseo_like_link' && event.target.innerHTML == 'Like'){
            pageInfo = pageType();
            category = 'post_options';
            action = 'like_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };

            pushGAEvent(category, action, label);
        } else if(event.target.innerHTML == 'Quote'){
            pageInfo = pageType();
            category = 'post_options';
            action = 'quote_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('class') == 'postReplyT' && event.target.innerHTML == 'Reply'){
            pageInfo = pageType();
            category = 'reply_to_post';
            action = 'reply_to_post_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('href')!=null && event.target.getAttribute('href').indexOf('editpost.php') != -1){
            pageInfo = pageType();
            category = 'post_options';
            action = 'edit_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.getAttribute('class') == 'searchLinks' && event.target.getAttribute('href').indexOf('searchthreadid') != -1){
            pageInfo = pageType();
            category = 'search_this_thread';
            action = 'advanced_search';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.getAttribute('class') == 'searchLinks' && event.target.getAttribute('href').indexOf('f=') != -1){
            pageInfo = pageType();
            category = 'search_this_forum';
            action = 'advanced_search';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('title')){
            if(event.target.getAttribute('title').indexOf('Show results') != -1){
                pageInfo = pageType();
                category = 'pagination';
                action = 'between_page_number';

                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'page': event.target.innerHTML,
                    'url_source': pageInfo.pathName,
                    'url_destination': event.target.getAttribute('href')
                };

                pushGAEvent(category, action, label);
            } else if(event.target.getAttribute('title').indexOf('First Page') != -1){
                pageInfo = pageType();
                category = 'pagination';
                action = 'first_page';

                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'url_destination': event.target.getAttribute('href')
                };

                pushGAEvent(category, action, label);
            } else if(event.target.getAttribute('title').indexOf('Last Page') != -1){
                pageInfo = pageType();
                category = 'pagination';
                action = 'last_page';

                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'url_destination': event.target.getAttribute('href')
                };

                pushGAEvent(category, action, label);
            } else if(event.target.getAttribute('title').indexOf('Next Page') != -1){
                pageInfo = pageType();
                category = 'pagination';
                action = 'next_page';

                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'url_destination': event.target.getAttribute('href')
                };

                pushGAEvent(category, action, label);
            } else if(event.target.getAttribute('title').indexOf('Prev Page') != -1){
                pageInfo = pageType();
                category = 'pagination';
                action = 'previous_page';

                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'url_destination': event.target.getAttribute('href')
                };

                pushGAEvent(category, action, label);
            }
        } else if(event.target.getAttribute('id') && event.target.getAttribute('id').indexOf('thread_title_') != -1){
            pageInfo = pageType();
            category = 'thread_listing';
            action = 'thread_click';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.getAttribute('class') == 'navbar' && event.target.parentNode.parentNode.getAttribute('class') == 'pl0 navIrefBlue'){
            pageInfo = pageType();
            category = 'breadcrumb_clicks';
            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('class') == 'gs-title' && window.location.pathname.indexOf('search-iref.php') != -1){
            pageInfo = pageType();
            category = 'search_result';
            action = 'search_result';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.getAttribute('href')
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('class') == 'sign_up '){
            pageInfo = pageType();
            category = 'signup_button';
            action = 'login_box';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };

            pushGAEvent(category, action, label);
        }else{
	        pageInfo = pageType();
	        category = $(event.target).attr('category');
	        action = $(event.target).attr('action');

	        if(action=='' || action==undefined){
	            return false;
	        }

	        if(category=='' || category==undefined){
	            category = pageInfo.pageType;
	        }
	        console.log(category+' '+action);
	        if(category!='' && category!=undefined && action!=undefined && action!=''){

	            var now = new Date().getTime();
	            var label = {
	                'skin': 'new',
	                'uid': window.client_id,
	                'user_id': window.analytics_userid,
	                'timestamp': now,
	                'url_source': pageInfo.pathName
	            };
	            var analytics_data = $(this).attr('analytics_data');
	            try {
	                analytics_data = JSON.parse(analytics_data);
	            } catch(e) {}
	            label['analytics_data'] = analytics_data;

	            pushGAEvent(category, action, label);
	        }        	
        }
    } else if(tagName == 'INPUT'){
        if(event.target.getAttribute('value') == 'Sign up'){
            pageInfo = pageType();
            category = 'complete_registration';
            action = 'complete_registration_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('value') == 'Search' && event.target.getAttribute('class') == 'b_search'){
            pageInfo = pageType();
            category = 'search';
            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'search_term': event.target.parentNode.children[0].value
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('value') == 'Log in'){
            pageInfo = pageType();
            category = 'login_in_login_box';
            action = pageInfo.pageType;
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('value') == 'Preview Post'){
            pageInfo = pageType();
            category = 'post_new_thread_window';
            action = 'preview_post';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('id') == 'manage_attachments_button'){
            pageInfo = pageType();
            category = 'post_new_thread_window';
            action = 'manage_attachments';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };

            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('id') == 'cb_postpoll'){
            if(event.target.checked){
                pageInfo = pageType();
                category = 'post_new_thread_window';
                action = 'post_a_poll';
                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName
                };

                pushGAEvent(category, action, label);
            }
        } else if(event.target.getAttribute('value') == 'Submit New Thread'){
            pageInfo = pageType();
            category = 'post_new_thread_window';
            action = 'submit_new_thread_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            pushGAEvent(category, action, label);
        } else if(event.target.value == 'Show Threads'){
            pageInfo = pageType();
            category = 'forum_display_options';
            action = 'show_threads_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            pushGAEvent(category, action, label);
        } else if(event.target.value == 'Add Subscription'){
            pageInfo = pageType();
            if(pageInfo.pathName.indexOf('&t=') || pageInfo.pathName.indexOf('?t=')){
                category = 'thread_subscribe'
            } else {
                category = 'forum_subscribe';
            }
            action = 'add_subcription';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'select_option': document.getElementsByName('emailupdate')[0][document.getElementsByName('emailupdate')[0].selectedIndex].text
            };
            pushGAEvent(category, action, label);
        } else if(event.target.value == 'Save' && event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('action') == 'vbfavorites.php'){
            pageInfo = pageType();
            if(pageInfo.pathName.indexOf('entry_type=post') != -1){
                category = 'post_options';
                action = 'save_add_post_to_fav';
            } else {
                category = 'thread_favorites';
                action = 'save_favorites';
            }
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            pushGAEvent(category, action, label);
        } else if(event.target.value == 'Post Quick Reply'){
            pageInfo = pageType();
            category = 'reply_to_post';
            action = 'post_quick_reply_button';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            pushGAEvent(category, action, label);
        } else if(event.target.getAttribute('value') == 'Search' && event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('class') == 'tborder tagSearchBox'){
            pageInfo = pageType();
            category = 'search';
            action = 'tag_search';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'search_term': event.target.parentNode.children[0].children[0].value
            };
            pushGAEvent(category, action, label);
        }
    } else if(tagName == 'SELECT'){
        if(event.target.getAttribute('name') == 'emailupdate'){
            pageInfo = pageType();
            category = 'post_new_thread_window';
            action = pageInfo.pageType;//+'_subscription'
            action = action.replace("_page", "");
            event.target.onchange = function(){
                select_option = event.target.options[event.target.options.selectedIndex].text;
                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'select_option': select_option
                };
                pushGAEvent(pageInfo.pageType, action+'_subscription', label);
            }
        } else if(event.target.getAttribute('name') == 'sort'){
            pageInfo = pageType();
            category = 'forum_display_options';
            action = 'sorted_by_option';
            now = new Date().getTime();
            event.target.onchange = function(){
                select_option = event.target.options[event.target.options.selectedIndex].text;
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'select_option': select_option
                };
                pushGAEvent(category, action, label);
            }
        } else if(event.target.getAttribute('name') == 'order'){
            pageInfo = pageType();
            category = 'forum_display_options';
            action = 'sort_order_option';
            now = new Date().getTime();
            event.target.onchange = function(){
                select_option = event.target.options[event.target.options.selectedIndex].text;
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'select_option': select_option
                };
                pushGAEvent(category, action, label);
            }
        } else if(event.target.getAttribute('name') == 'daysprune'){
            pageInfo = pageType();
            category = 'forum_display_options';
            action = 'from_the_option';
            now = new Date().getTime();
            event.target.onchange = function(){
                select_option = event.target.options[event.target.options.selectedIndex].text;
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'select_option': select_option
                };
                pushGAEvent(category, action, label);
            }
        }
    } else if(tagName == 'STRONG' && event.target.parentNode.parentNode.parentNode.getAttribute('class') == 'alt1Active'){
        pageInfo = pageType();
        category = 'forum_listing_homepage';
        action = 'forum';
        now = new Date().getTime();
        var label = {
            'skin': 'new',
            'uid': window.client_id,
            'user_id': window.analytics_userid,
            'timestamp': now,
            'url_source': pageInfo.pathName,
            'url_destination': event.target.parentNode.getAttribute('href')
        };
        pushGAEvent(category, action, label);
    } else if(tagName == 'I'){
        if(event.target.getAttribute('title') == 'Go to last post'){
            pageInfo = pageType();
            category = 'forum_listing_homepage';
            action = 'go_to_last_post';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'url_destination': event.target.parentNode.getAttribute('href')
            };
            pushGAEvent(category, action, label);
        } else if(event.target.parentNode.parentNode.getAttribute('class') == 'iref_search_relative' && event.target.parentNode.getAttribute('class') == 'b_search'){
            pageInfo = pageType();
            category = (pageInfo.pathName.indexOf('/t-') != -1 ? 'search_this_thread':'search_this_forum');
            action = 'search_go';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'search_term': event.target.parentNode.parentNode.children[0].value,
                'filter': (document.getElementById('rb_nb_sp3').checked ? 'Show Posts': 'Show Threads')
            };
            pushGAEvent(category, action, label);
        } 
        else if(event.target.parentNode.getAttribute('title')){
            if(event.target.parentNode.getAttribute('title').indexOf('Next Page') != -1){
                pageInfo = pageType();
                category = 'pagination';
                action = 'next_page';

                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'url_destination': event.target.getAttribute('href')
                };

                pushGAEvent(category, action, label);
            }
        } else if(event.target.parentNode.getAttribute('title')){
            if(event.target.parentNode.getAttribute('title').indexOf('Next Page') != -1){
                pageInfo = pageType();
                category = 'pagination';
                action = 'previous_page';

                now = new Date().getTime();
                var label = {
                    'skin': 'new',
                    'uid': window.client_id,
                    'user_id': window.analytics_userid,
                    'timestamp': now,
                    'url_source': pageInfo.pathName,
                    'url_destination': event.target.getAttribute('href')
                };

                pushGAEvent(category, action, label);
            }
        }
    } else if(tagName == 'BUTTON'){
        if(event.target.parentNode.getAttribute('class') == 'iref_search_relative' && event.target.getAttribute('class') == 'b_search'){
            pageInfo = pageType();
            category = (pageInfo.pathName.indexOf('/t-') != -1 ? 'search_this_thread':'search_this_forum');
            action = 'search_go';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName,
                'search_term': event.target.parentNode.children[0].value,
                'filter': (document.getElementById('rb_nb_sp3').checked ? 'Show Posts': 'Show Threads')
            };
            pushGAEvent(category, action, label);
        }else if(event.target.getAttribute('class') == 'builder_submit'){
            pageInfo = pageType();
            category = 'builder_signup';
            action = 'complete_builder_signup';
            now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            pushGAEvent(category, action, label);
        }
    }else if(tagName == 'SPAN'){
        pageInfo = pageType();
        category = $(event.target).attr('category');
        action = $(event.target).attr('action');

        if(action=='' || action==undefined){
            return false;
        }

        if(category=='' || category==undefined){
            category = pageInfo.pageType;
        }
        console.log(category+' '+action);
        if(category!='' && category!=undefined && action!=undefined && action!=''){

            var now = new Date().getTime();
            var label = {
                'skin': 'new',
                'uid': window.client_id,
                'user_id': window.analytics_userid,
                'timestamp': now,
                'url_source': pageInfo.pathName
            };
            var analytics_data = $(this).attr('analytics_data');
            try {
                analytics_data = JSON.parse(analytics_data);
            } catch(e) {}
            label['analytics_data'] = analytics_data;

            pushGAEvent(category, action, label);
        }
    }
    
}, true);

function pageType(){
    var pageType = 'other_page';
    var pathName = window.location.pathname + window.location.search;

    var segment = pathName.split("/").length - 1 - (pathName.indexOf("https://")==-1?0:2);
    //console.log();
    var res = pathName.substr(pathName.lastIndexOf('/') + 1).split("-");
    //console.log(res);
    //console.log(res[0]+' '+'pradeep');
    //console.log(segment);
    if((pathName.indexOf('/forum') != -1 && segment == 5 && ((pathName.match(/page/g) || []).length || (!isNaN(res[0]) && res[0]!=0)) ) || (pathName.indexOf('/forum') != -1 && segment == 4 && (pathName.match(/page/g) || []).length <=0 && !isNaN(res[0]) && res[0]!=0)){
        pageType = 'thread_page';
    }else if((pathName.indexOf('/forum') != -1 && segment == 5) ||(pathName.indexOf('/forum') != -1 && segment == 4 && (((pathName.match(/page/g) || []).length >0) || isNaN(res[0]))) || (pathName.indexOf('/forum') != -1 && segment == 3)){
        pageType = 'forum_page';
    }else if(pathName.indexOf('/index.') != -1 || pathName.length < 3){
        pageType = 'home_page';
    } else if(pathName.indexOf('search-iref.php') != -1){
        pageType = 'google_search_listing_page';
    }else if(pathName.indexOf('register') != -1){
        pageType = 'register';
    }else if(pathName.indexOf('builder') != -1){
        pageType = 'builder_signup';
    }else if(pathName.indexOf('new-content') != -1){
        pageType = 'new_thread';
    }else if(pathName.indexOf('search') != -1){
        pageType = 'search_listing_page';
    }else if(pathName.indexOf('member') != -1){
        pageType = 'profile_page';
    }else if(pathName.indexOf('privatemessage') != -1){
        pageType = 'messages_page';
    }
    
    return {'pageType': pageType, 'pathName': pathName};
}

function getTimeDiff(start, end){
    return (end - start)/1000;
}

var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

if(pageType().pageType == 'thread_page1'){
    var posts = document.getElementById('posts').children;
    var currentpostid = null;
    var leavingTime = {};
    var enterTime = {};
    if(posts != null){
        for (var i = 0; i < posts.length; i++) {
            ("mouseleave keyup".split(" ")).forEach(function(e){
                posts[i].addEventListener(e, function(event){
                    var postid =  event.target.children[0].children[0].children[0].getAttribute('id').replace('edit', '');
                    if(enterTime.postid){
                        var time_spent = getTimeDiff(enterTime.postid, Date.now()).toString();
                        if(time_spent > 3){
                            var label = {
                                'skin': 'new',
                                'uid': window.client_id,
                                'user_id': window.analytics_userid,
                                'post_id': postid,
                                'time_spent': time_spent,
                                'timestamp': new Date().getTime(),
                                'url_source': pageType().pathName
                            };
                            pushGAEvent('page_view_time', 'page_view_time', label);
                        }
                    } else if(postid) {
                        leavingTime.postid = Date.now();
                    }
                });
            });

            vis(function(){
                if(!vis()){
                    enterTime = {};
                }
            });

            posts[i].addEventListener('mouseenter', function(event){
                var postid =  event.target.children[0].children[0].children[0].getAttribute('id').replace('edit', '');
                if(postid){
                    enterTime.postid = Date.now();
                }
            })
        }
    }
}

if(pageType().pageType == 'thread_page1'){
    var elements = $('div[category=click_project_button]');
    var element_leavingTime = {};
    var element_enterTime = {};
    var current_element = null;
    if(elements){
        for (var i = 0; i < elements.length; i++) {
            ("mouseleave keyup".split(" ")).forEach(function(e){
                elements[i].addEventListener(e, function(event){
                    var element_name = $(this).attr('action');
                    if(element_enterTime.element_name){
                        var time_spent = getTimeDiff(element_enterTime.element_name, Date.now()).toString();
                        if(time_spent > 3){
                            var label = {
                                'skin': 'new',
                                'uid': window.client_id,
                                'user_id': window.analytics_userid,
                                'time_spent': time_spent,
                                'timestamp': new Date().getTime(),
                                'url_source': pageType().pathName
                            };
                            var analytics_data = $(this).attr('analytics_data');
                            try {
                                analytics_data = JSON.parse(analytics_data);
                            } catch(e) {}
                            label['analytics_data'] = analytics_data;
                            pushGAEvent('hover_project_button', element_name, label);
                        }
                    } else if(element_name) {
                        element_leavingTime.element_name = Date.now();
                    }
                });
            });

            vis(function(){
                if(!vis()){
                    element_enterTime = {};
                }
            });

            elements[i].addEventListener('mouseenter', function(event){
                var element_name = $(this).attr('action');
                if(element_name){
                    element_enterTime.element_name = Date.now();
                }
            })
        }
    }
}

if(pageType().pageType!=''){
    var pathName = window.location.pathname + window.location.search;
    var res = pathName.substr(pathName.lastIndexOf('/') + 1).split("=");

    var generatedID=res[1];
    
    if(pathName.indexOf('?_=') != -1){
        if(Cookies.get('generatedID')!=generatedID){
        pageType = 'signin_success'; 
         var labelCustom = {
            'skin': 'new',
            'uid': window.client_id,
            'session_id': window.analytics_session,
            'user_id': window.analytics_userid,
            'timestamp': new Date().getTime(),
            'url_source': pathName,
            'source': source(),
        };
        Cookies.set('generatedID',generatedID);
        pushGAEvent('home_page','signin_success',labelCustom);
        }

    }
}

function forcedSignup(){
          var pageInfo = pageType();
          var labelCustom = {
              'skin': 'new',
              'uid': window.client_id,
              'session_id': window.analytics_session,
              'user_id': window.analytics_userid,
              'timestamp': new Date().getTime(),
              'url_source': pageInfo.pathName,
              'source': source(),
          };
          pushGAEvent('impressions','forced_signup',labelCustom);
}


$(window).load(function () {
   sendPageURLEvent();
    if (impression_category_list.length > 0){
        push_impressions();
    }
});
