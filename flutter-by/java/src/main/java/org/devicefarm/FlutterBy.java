package org.devicefarm;

import org.openqa.selenium.By;
import org.openqa.selenium.InvalidSelectorException;
import org.openqa.selenium.SearchContext;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.internal.Require;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FlutterBy {

    public static By text(String text) {
        return new ByText(text);
    }

    public static By type(String type) {
        return new ByType(type);
    }

    public static By key(String key) {
        return new ByKey(key);
    }

    public static By semanticsLabel(String label) {
        return new BySemanticsLabel(label);
    }


    private static class ByText extends BaseW3CLocator {
        private final String text;

        public ByText(String text) {
            super("text", Require.argument("Text", text).nonNull("Cannot find elements when the text is null."));

            if (text.isEmpty()) {
                throw new InvalidSelectorException("text must not be blank");
            }

            this.text = text;
        }

        @Override
        public String toString() {
            return "FlutterBy.text: " + text;
        }
    }

    private static class ByType extends BaseW3CLocator {
        private final String type;

        public ByType(String type) {
            super("type", Require.argument("type", type).nonNull("Cannot find elements when the type is null."));

            if (type.isEmpty()) {
                throw new InvalidSelectorException("type must not be blank");
            }

            this.type = type;
        }

        @Override
        public String toString() {
            return "FlutterBy.type: " + type;
        }
    }

    private static class ByKey extends BaseW3CLocator {
        private final String key;

        public ByKey(String key) {
            super("key", Require.argument("key", key).nonNull("Cannot find elements when the key is null."));

            if (key.isEmpty()) {
                throw new InvalidSelectorException("key must not be blank");
            }

            this.key = key;
        }

        @Override
        public String toString() {
            return "FlutterBy.key: " + key;
        }
    }

    private static class BySemanticsLabel extends BaseW3CLocator {
        private final String label;

        public BySemanticsLabel(String label) {
            super("semantics label", Require.argument("label", label).nonNull("Cannot find elements when the label is null."));

            if (label.isEmpty()) {
                throw new InvalidSelectorException("label must not be blank");
            }

            this.label = label;
        }

        @Override
        public String toString() {
            return "FlutterBy.label: " + label;
        }
    }

    public static class BaseW3CLocator extends By implements By.Remotable {

        private final Parameters params;

        protected BaseW3CLocator(String using, String value) {
            this.params = new Parameters(using, value);
        }

        @Override
        public WebElement findElement(SearchContext context) {
            Require.nonNull("Search Context", context);
            return context.findElement(this);
        }

        @Override
        public List<WebElement> findElements(SearchContext context) {
            Require.nonNull("Search Context", context);
            return context.findElements(this);
        }

        @Override
        public final Parameters getRemoteParameters() {
            return params;
        }

        protected final Map<String, Object> toJson() {
            Map<String, Object> json = new HashMap<>();
            json.put("using", params.using());
            json.put("value", params.value());
            return Collections.unmodifiableMap(json);
        }
    }

}
